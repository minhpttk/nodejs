const ProductService = require('../services/product.service');
const { BadRequestError } = require('../core/error.response');
const { SuccessResponse } = require('../core/success.response');

class ProductController {

    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create product successfully',
            metadata: await ProductService.FactoryProduct(req.body.product_type, req.body.product_attributes)
        }).send(res);
    };
}

module.exports = new ProductController();