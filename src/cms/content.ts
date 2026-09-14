import 'server-only';
import { cache } from 'react';
import { queryPublished } from './client';
import {
  articleModel,
  projectModel,
  promotionModel,
  isActivePromotion,
} from './models';
import type { Article, Project } from '@/content/types';

// Projections deliberately exclude editor notes and unconfirmed claims.
export const imageProjection = `{
  "src": coalesce(asset->url, legacySrc), alt, caption,
  "width": coalesce(asset->metadata.dimensions.width, 1600),
  "height": coalesce(asset->metadata.dimensions.height, 900),
  "placeholder": !defined(asset)
}`;
const bodyProjection = `content[]{..., _type == "siteImage" => ${imageProjection}}`;
const shared = `"id": _id, title, "slug": slug.current, summary, publishedAt, "updatedAt": coalesce(updatedAt,_updatedAt), seoTitle,seoDescription,"richContent": ${bodyProjection}`;
export const getSanityProjects = cache(async (): Promise<Project[]> => {
  const docs = await queryPublished<
    unknown[]
  >(`*[_type == "project" && approvedForPublication == true && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){
    ${shared},customerName,customerType,location,province,"systemCapacityKw":systemCapacity,phase,"solarPanel":solarPanels,panelQuantity,inverter,battery,optimizer,systemType,zeroExport,monitoring,
    "estimatedSavingsThbPerMonth":estimatedSavings,featured,standards,servicesIncluded,warranty,
    "gallery": [coverImage ${imageProjection}] + coalesce(gallery[] ${imageProjection},[])
  }`);
  return docs.map((doc) => ({
    ...projectModel.parse(doc),
    overview: '',
    objective: [],
    solution: [],
    installation: [],
    benefits: [],
  }));
});
export const getSanityArticles = cache(async (): Promise<Article[]> => {
  const docs = await queryPublished<
    unknown[]
  >(`*[_type == "article" && approvedForPublication == true && defined(slug.current) && publishedAt <= now()] | order(publishedAt desc){
    ${shared},category,"tags":coalesce(tags,[]),"featuredImage":featuredImage ${imageProjection},author,featured,"related":related[]->slug.current,faq
  }`);
  return docs.map((doc) => ({ ...articleModel.parse(doc), content: [] }));
});
export async function getSanityPromotions() {
  const docs = await queryPublished<
    unknown[]
  >(`*[_type == "promotion" && approvedForPublication == true && active == true] | order(startDate desc){
    "slug":slug.current,title,price,systemSize,phase,solarPanel,panelQuantity,battery,"includedServices":coalesce(includedServices,[]),terms,"image":image ${imageProjection},active,startDate,endDate
  }`);
  return docs
    .map((doc) => promotionModel.parse(doc))
    .filter((p) => isActivePromotion(p));
}
