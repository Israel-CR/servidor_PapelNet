const Products = require("../models/Products");
const Sales = require("../models/Sales");

const SalesController = {};

// Agregar una nueva venta
SalesController.addSales = async (req, res) => {
  const userId = req.user.id;
  const { productos, subtotal, descuento, total } = req.body;
  try {
    const venta = new Sales({
      vendedor: userId,
      subtotal,
      descuento,
      total,
    });
    for (const item of productos) {
      // buscar el producto
      const producto = await Products.findById(item.producto);

      if (!producto) {
        throw new Error(`Producto con ID ${item.producto} no encontrado`);
      }

      // agregar el producto a la venta
      venta.productos.push({
        producto: item.producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        precio_total: item.precio_total,
      });

      // actualizar el stock del producto
      producto.stock -= item.cantidad;
      await producto.save();
    }
    venta.total = total;
    const saleSaved = await venta.save();

    res.json({ message: "Venta agregada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

SalesController.addProductsForSale = async (req, res) => {
  const ventaId = req.params.id;
  const { cantidad, precio, idProducto } = req.body;
  try {
    const venta = await Sales.findById(ventaId);
    // buscar el producto
    const producto = await Products.findById(idProducto);
    // verificar si el producto existe
    if (!producto)
      return res.status(404).json({ message: "Producto no encontrado" });

    // calcular precio por producto
    const precio_total = cantidad * precio;
    // Buscar producto en productos de la venta
    const productoEnVenta = venta.productos.find(
      (producto) => producto.producto == idProducto
    );
    // Si el producto ya se encuentra en la venta actualizar y guardarlo
    if (productoEnVenta) {
      productoEnVenta.cantidad += cantidad;
      productoEnVenta.precio_total += precio_total;
    } else {
      // Si no existe el producto agregarlo
      venta.productos.push({
        producto: idProducto,
        cantidad: cantidad,
        precio_unitario: precio,
        precio_total,
      });
    }
    // actualizando el total de venta
    venta.total += precio_total;
    const updatedSale = await venta.save();

    //actualizar el stock del producto
    producto.stock -= cantidad;
    const updatedProduct = await producto.save();

    return res.json(updatedSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

SalesController.updateProductsForSale = async (req, res) => {
  const ventaId = req.params.id;
  const { cantidad, idProducto } = req.body;
  try {
    const venta = await Sales.findById(ventaId);
    if (!venta) return res.status(204).json({ message: "venta inexistente" });
    // buscar el producto
    const producto = await Products.findById(idProducto);

    // buscar el producto en la venta y actualizarlo
    const productoEnVenta = venta.productos.find(
      (producto) => producto.producto == idProducto
    );
    if (!productoEnVenta) {
      return res.status(404).json({ error: "producto no encontrado" });
    }

    // actualizar el stock con la nueva cantidad
    producto.stock += productoEnVenta.cantidad;
    producto.stock -= cantidad;

    productoEnVenta.cantidad = cantidad;

    // actualizar el total de la compra dependiendo de la nueva cantidad
    venta.total -= productoEnVenta.precio_total;
    venta.total += cantidad * productoEnVenta.precio_unitario;
    productoEnVenta.precio_total = cantidad * productoEnVenta.precio_unitario;

    // actualizar los datos del producto en venta
    const updatedSale = await venta.save();
    // actualizar los datos del producto
    const updatedProduct = await producto.save();
    return res.json(updatedSale);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

SalesController.deleteProductsForSale = async (req, res) => {
  const ventaId = req.params.idventa;
  const idProducto = req.params.idproducto;

  try {
    const venta = await Sales.findById(ventaId);
    // buscar el producto
    const producto = await Products.findById(idProducto);

    // Buscar producto en productos de la venta
    const productoEnVenta = venta.productos.find(
      (producto) => producto.producto == idProducto
    );

    if (!productoEnVenta) {
      return res.status(404).json({ error: "producto no encontrado" });
    }

    const cantidad = productoEnVenta.cantidad;
    const precio_total = productoEnVenta.precio_total;
    // actualizando el total de venta
    venta.total -= precio_total;

    //eliminar el producto en los productos de la venta
    venta.productos = venta.productos.filter((producto) => {
      return producto.producto != idProducto;
    });

    // actualizar la venta
    const ventaUpdated = await venta.save();

    // actualizando el stock del producto
    producto.stock += cantidad;
    const productUpdated = await producto.save();

    res.status(204).json({ message: "producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

SalesController.completeSale = async (req, res) => {
  const ventaId = req.params.id;

  try {
    const venta = await Sales.findById(ventaId);
    if (!venta) return res.status(204).json({ message: "venta inexistente" });

    // verificar si tiene productos
    if (!venta.productos.length) {
      // si no tiene productos eliminar la venta
      const ventaDeleted = await Sales.findByIdAndDelete(ventaId);
      return res.status(204).json({ message: "venta eliminada correctamente" });
    }

    // si tiene productos cambiar el estado a finalizado
    venta.estado = "FINALIZADO";

    const ventaSaved = await venta.save();

    res.json({ message: "compra finalizada" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las ventas registradas

SalesController.getSalesCompleted = async (req, res) => {
  try {
    const ventasFinalizadas = await Sales.find()
      .populate("productos.producto", "nombre descripcion")
      .populate("vendedor", "nombre")
      .populate("productos.producto.imagen");
    res.status(201).json(ventasFinalizadas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

SalesController.getSalesById = async (req, res) => {
  const ventaId = req.params.id;
  try {
    const venta = await Sales.findById(ventaId);
    if (!venta) return res.status(204).json({ message: "venta inexistente" });
    res.status(201).json(venta);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

SalesController.deleteSale = async (async) => {
  try {
    const ventaId = req.params.id;
    const venta = await Sales.findById(ventaId);
    if (!venta) return res.status(204).json({ message: "venta inexistente" });
    await Sales.findByIdAndDelete(ventaId);
    res.status(201).json({ message: "venta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

SalesController.getSalesPerMonth = async (req, res) => {
  const year = req.params.year;
  const month = req.params.month;

  try {
    const ventas = await Sales.find({
      fecha: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month}-31`),
      },
    });

    if (!ventas.length)
      return res.status(204).json({ message: "No hay ventas en este mes" });

    // agrupar ventas por dia y generar, el dia(fecha), total de ventas y subtotal descuentos, productos vendidospor dia, tomando en cuenta que en un dia se registran mas de una venta y devolver un array con las ventas de todos los dias en general total, total subtototal, total descuentos, total productos.
    const ventasMesPorDia = ventas.reduce((acc, venta) => {
      //la variable fecha debe devolver este formato [mes-dia-año]
      const date = venta.fecha.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const fecha = date.split("/").join("-");

      const index = acc.findIndex((item) => item.fecha === fecha);
      if (index === -1) {
        acc.push({
          fecha,
          total: venta.total,
          subtotal: venta.subtotal,
          descuento: venta.descuento,
          productos: venta.productos.length,
        });
      } else {
        acc[index].total += venta.total;
        acc[index].subtotal += venta.subtotal;
        acc[index].descuento += venta.descuento;
        acc[index].productos += venta.productos.length;
      }
      return acc;
    }, []);

    res.status(201).json(ventasMesPorDia);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = SalesController;
