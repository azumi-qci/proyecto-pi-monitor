export const toCamelCase = (item: any) => {
  return {
    id: item.id,
    name: item.name,
    carBrand: item.car_brand,
    carColor: item.car_color,
    carPlate: item.car_plate,
    accessDaytime: item.access_daytime,
    doorId: item.id_door,
    visitLocation: item.visit_location,
    checked: item.checked,
  };
};
