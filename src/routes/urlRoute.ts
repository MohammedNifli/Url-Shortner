import ShortUrlController from "../controllers/urlController.js";
import UrlRepository from "../repositories/urlRepository.js";
import UrlShortenService from "../services/urlService.js";
import express from "express";
import osInfoMiddleware from '../middlewares/InfoMiddleware.js'
import {createUrlRateLimiter} from '../middlewares/rateLimiter.js'
import {authenticateJWT} from '../middlewares/authMiddleware.js'

const urlRoute = express.Router();


const urlRepository = new UrlRepository();
const urlShortenService = new UrlShortenService(urlRepository);
const shortenUrlController = new ShortUrlController(urlShortenService);


urlRoute.post('/shorten', createUrlRateLimiter,shortenUrlController.create.bind(shortenUrlController));
urlRoute.get('/shorten/:alias',osInfoMiddleware,shortenUrlController.redirectToOriginalUrl.bind(shortenUrlController))
urlRoute.get('/analytics/overall',authenticateJWT,shortenUrlController.getOverallAnalytics.bind(shortenUrlController));
urlRoute.get('/analytics/:alias',authenticateJWT,shortenUrlController.getAnalytics.bind(shortenUrlController))

urlRoute.get('/analytics/topic/:topic',authenticateJWT,shortenUrlController.getAnalyticsByTopic.bind(shortenUrlController))


  

export default urlRoute;
