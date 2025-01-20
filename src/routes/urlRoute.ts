import ShortUrlController from "../controllers/urlController.js";
import UrlRepository from "../repositories/urlRepository.js";
import UrlShortenService from "../services/urlService.js";
import express from "express";
import osInfoMiddleware from '../middlewares/InfoMiddleware.js'
import { url } from "inspector";
import { Request,Response } from "express";

const urlRoute = express.Router();


const urlRepository = new UrlRepository();
const urlShortenService = new UrlShortenService(urlRepository);
const shortenUrlController = new ShortUrlController(urlShortenService);


urlRoute.post('/shorten', shortenUrlController.create.bind(shortenUrlController));
urlRoute.get('/shorten/:alias',osInfoMiddleware,shortenUrlController.redirectToOriginalUrl.bind(shortenUrlController))
urlRoute.get('/analytics/:alias',shortenUrlController.getAnalytics.bind(shortenUrlController))

urlRoute.get('/analytics/topic/:topic',shortenUrlController.getAnalyticsByTopic.bind(shortenUrlController))

urlRoute.get('/analytics/overall/:userId', shortenUrlController.getOverallAnalytics.bind(shortenUrlController));
  

export default urlRoute;
