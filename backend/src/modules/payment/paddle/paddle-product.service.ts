import {
    Injectable,
    InternalServerErrorException,
    Logger,
    NotFoundException,
    OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { GraphQLError } from "graphql";
import { PrismaService } from "nestjs-prisma";
import { CreatePriceInputData, UpdatePriceInputData } from "./dtos/price.dto";
import {
    CreateProductInputData,
    UpdateProductInputData,
} from "./dtos/product.dto";
import { PaddleService } from "./paddle.service";

@Injectable()
export class PaddleProductService extends PaddleService {
    constructor(protected readonly configService: ConfigService) {
        super(configService);
    }

    // --- Product Methods ---
    async listProducts() {
        this.logger.log("Listing products from Paddle");
        try {
            const products = [];
            for await (const product of this.paddle.products.list()) {
                products.push(product);
            }
            this.logger.debug(`Retrieved ${products.length} products`);
            return products;
        } catch (error) {
            this.handlePaddleError(error, "listProducts");
        }
    }

    async createProduct(data: CreateProductInputData) {
        this.logger.log(`Creating product in Paddle with name: ${data.name}`);
        try {
            const newProduct = await this.paddle.products.create(data);
            this.logger.log(
                `Successfully created product with ID: ${newProduct.id}`,
            );
            return newProduct;
        } catch (error) {
            this.handlePaddleError(error, "createProduct");
        }
    }

    async getProduct(id: string) {
        this.logger.log(`Getting product from Paddle with ID: ${id}`);
        try {
            const product = await this.paddle.products.get(id);
            if (!product) {
                throw new NotFoundException(
                    `Product with ID ${id} not found in Paddle.`,
                );
            }
            this.logger.debug(`Retrieved product: ${product.name}`);
            return product;
        } catch (error) {
            if (error?.status === 404 || error instanceof NotFoundException) {
                throw new NotFoundException(
                    `Product with ID ${id} not found in Paddle.`,
                );
            }
            this.handlePaddleError(error, "getProduct");
        }
    }

    async updateProduct(id: string, data: UpdateProductInputData) {
        this.logger.log(`Updating product in Paddle with ID: ${id}`);
        try {
            await this.getProduct(id);
            const updatedProduct = await this.paddle.products.update(id, data);
            this.logger.log(`Successfully updated product with ID: ${id}`);
            return updatedProduct;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.handlePaddleError(error, "updateProduct");
        }
    }

    // --- Price Methods ---
    async listPrices() {
        this.logger.log("Listing prices from Paddle");
        try {
            const prices = [];
            for await (const price of this.paddle.prices.list()) {
                prices.push(price);
            }
            this.logger.debug(`Retrieved ${prices.length} prices`);
            return prices;
        } catch (error) {
            this.handlePaddleError(error, "listPrices");
        }
    }

    async createPrice(data: CreatePriceInputData) {
        this.logger.log(
            `Creating price in Paddle for product ID: ${data.productId}`,
        );
        try {
            await this.getProduct(data.productId);
            const newPrice = await this.paddle.prices.create(data);
            this.logger.log(
                `Successfully created price with ID: ${newPrice.id} for product ${data.productId}`,
            );
            return newPrice;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new GraphQLError(
                    `Cannot create price: Product with ID ${data.productId} not found.`,
                    {
                        extensions: { code: "PRODUCT_NOT_FOUND" },
                    },
                );
            }
            this.handlePaddleError(error, "createPrice");
        }
    }

    async getPrice(id: string) {
        this.logger.log(`Getting price from Paddle with ID: ${id}`);
        try {
            const price = await this.paddle.prices.get(id);
            if (!price) {
                throw new NotFoundException(
                    `Price with ID ${id} not found in Paddle.`,
                );
            }
            this.logger.debug(`Retrieved price: ${price.description}`);
            return price;
        } catch (error) {
            if (error?.status === 404 || error instanceof NotFoundException) {
                throw new NotFoundException(
                    `Price with ID ${id} not found in Paddle.`,
                );
            }
            this.handlePaddleError(error, "getPrice");
        }
    }

    async updatePrice(id: string, data: UpdatePriceInputData) {
        this.logger.log(`Updating price in Paddle with ID: ${id}`);
        try {
            await this.getPrice(id);
            const updatedPrice = await this.paddle.prices.update(id, data);
            this.logger.log(`Successfully updated price with ID: ${id}`);
            return updatedPrice;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.handlePaddleError(error, "updatePrice");
        }
    }
}
