import I1776_unites from './resources/1776_unites.webp';
import I1776_report from './resources/1776_report.webp';
import bill_of_rights from './resources/bill_of_rights.webp';
import declaration_of_independence from './resources/declaration_of_independence.webp';
import founding_fathers from './resources/founding_fathers.webp';
import hillsdale_library from './resources/hillsdale_library.webp';
import liberty_documents from './resources/liberty_documents.webp';
import lincoln_presidential_library from './resources/lincoln_presidential_library.webp';
import pepperdine_colonial_collection from './resources/pepperdine_colonial_collection.webp';
import prager_u from './resources/prager_u.webp';
import reagan_library from './resources/reagan_library.webp';
import the_federalist_papers from './resources/the_federalist_papers.webp';
import us_constitution from './resources/us_constitution.webp';

import business_placeholder from './business-placeholder.png';

const Images = {
  // resource images
  '1776_unites': I1776_unites,
  '1776_report': I1776_report,
  bill_of_rights,
  declaration_of_independence,
  founding_fathers,
  hillsdale_library,
  liberty_documents,
  lincoln_presidential_library,
  pepperdine_colonial_collection,
  prager_u,
  reagan_library,
  the_federalist_papers,
  us_constitution,

  // Business Image Placeholder
  business_placeholder,
};

export type ImagesType = keyof typeof Images;

export {Images};
