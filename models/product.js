module.exports = (sequelize, Sequelize) => {
	const Product = sequelize.define("product", {
		name: {
			type: Sequelize.STRING
		},
		quantity: {
			type: Sequelize.INTEGER
		},
		price: {
			type: Sequelize.FLOAT
		}		
	});

	return Product;
};