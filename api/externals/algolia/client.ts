import { getManifestExtra } from '@/extra';
import algoliasearch from 'algoliasearch/lite';
import { SearchKind, SearchOrder } from './types';

const extra = getManifestExtra();
const config = extra.algolia;
const env = extra.env;

const client = algoliasearch(config.appId, config.apiKey);
const restaurants = client.initIndex(`${env}_businesses`);
const restaurantsByPrice = client.initIndex(`${env}_businesses_price_asc`);
const restaurantsByPreparationTime = client.initIndex(`${env}_businesses_preparation_time_asc`);
const restaurantsByTotalOrders = client.initIndex(`${env}_businesses_totalOrders_desc`);
const restaurantsByAverageDiscount = client.initIndex(`${env}_businesses_averageDiscount_desc`);
const restaurantsByPositiveReviews = client.initIndex(`${env}_businesses_positiveReviews_desc`);
const products = client.initIndex(`${env}_products`);
const productsByPrice = client.initIndex(`${env}_products_price_asc`);
const productsByTotalSold = client.initIndex(`${env}_products_totalSold_desc`);

export const getSearchIndex = (kind: SearchKind, order: SearchOrder) => {
  if (kind === 'restaurant') {
    if (order === 'distance') return restaurants;
    else if (order === 'price') return restaurantsByPrice;
    else if (order === 'preparation-time') return restaurantsByPreparationTime;
    else if (order === 'popularity') return restaurantsByTotalOrders;
    else if (order === 'average-discount') return restaurantsByAverageDiscount;
    else if (order === 'reviews') return restaurantsByPositiveReviews;
  } else if (kind === 'product') {
    if (order === 'distance') return products;
    else if (order === 'price') return productsByPrice;
    else if (order === 'popularity') return productsByTotalSold;
    return products;
  }
};

export const clearAlgoliaCache = () => client.clearCache();
