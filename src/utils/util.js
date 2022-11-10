//  const isEmpty = (value: string | number | object): boolean => {
//   if (value === null) {
//     return true;
//   } else if (typeof value !== 'number' && value === '') {
//     return true;
//   } else if (typeof value === 'undefined' || value === undefined) {
//     return true;
//   } else if (value !== null && typeof value === 'object' && !Object.keys(value).length) {
//     return true;
//   } else {
//     return false;
//   }
// };

/**
 * @method enhanceTranslate
 * @returns array
 * @description this value is Empty Check
 * @param arrayData
 * @param originalLanguage
 * @param languageKey
 * @param removeIds
 */
const enhanceTranslate = (
  arrayData,
  originalLanguage,
  languageKey,
  removeIds = false
) => {
  let objects = [];
  for (const i in arrayData) {
    if (Object.prototype.hasOwnProperty.call(arrayData, i))
      if (typeof arrayData[i] === 'object') {
        if (
          Object.prototype.hasOwnProperty.call(arrayData[i], 'translations')
        ) {
          let res = {};
          arrayData[i].translations.map((a) => {
            res = { ...res, ...a };
            return a;
          });
          arrayData[i] = { ...arrayData[i], ...res };
          delete arrayData[i].translations;
        }
        objects = objects.concat(
          enhanceTranslate(
            arrayData[i],
            originalLanguage,
            languageKey,
            removeIds
          )
        );
      } else if (i === originalLanguage) {
        arrayData[arrayData[originalLanguage]] = arrayData.originalText;
        delete arrayData[originalLanguage];
        delete arrayData.originalText;
      } else if (i === languageKey) {
        arrayData[arrayData[languageKey]] = arrayData.translation;
        delete arrayData[languageKey];
        delete arrayData.translation;
      } else if (i.slice(-'Id'.length) === 'Id' && removeIds) {
        console.log(i);
        delete arrayData[i];
      }
  }
  return arrayData;
};
module.exports = { enhanceTranslate };
