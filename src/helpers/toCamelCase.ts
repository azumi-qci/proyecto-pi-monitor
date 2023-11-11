export const toCamelCase = (item: any) => {
  return {
    id: item.id,
    name: item.name,
    carBrand: item.car_brand,
    carColor: item.car_color,
    carPlate: item.car_plate,
    entranceHour: item.entrance_hour,
    entranceDay: item.entrance_day,
    doorId: item.id_door,
    visitLocation: item.visit_location,
    checked: item.checked,
  };
};
