import axios from "axios";

export const generateRandomWord = (length) => {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // Generate a random length between 1 and 10 if length is not provided
  if (!length) {
    length = Math.floor(Math.random() * 10) + 1;
  }

  let randomWord = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomWord += characters[randomIndex];
  }

  return randomWord;
}


export const getAvatarSVG = async (avatarId) => {
  if (!avatarId) avatarId = generateRandomWord(10)
  const res = await axios.get(`https://api.multiavatar.com/${JSON.stringify(avatarId)}?apiKey=${process.env.AVATAR_API_KEY}`);
  const svg = await res.data;
  return svg;
}

export const minuteToHour = (min) => {
  const hour = parseInt(min / 60);;
  let extraMinutes = min - (hour * 60);
  if(extraMinutes < 10) extraMinutes = `0${extraMinutes}`

  return {hour:hour, minutes:extraMinutes}
}

export const websiteName = "Cinemate"