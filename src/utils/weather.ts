export const updateUserWeather = async (
  user: any,
  getWeather: (lat: number, long: number) => Promise<any>
) => {
  if (!user.isOnline) return user;

  const weather = await getWeather(user.latitude, user.longitude);
  return {
    ...user,
    rainfall: user.rainfall + (weather.rainfall || 0),
    weather,
  };
};
