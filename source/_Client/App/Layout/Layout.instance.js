module.exports = {
  area: {
    type: "Choice",
    choices: ["country", "region"],
    defaultValue: "country",
  },
  map: "MapView",
  list: "CollectionView",
  selectedCountry: "Text",
  selectedRegion: "Text",
}
