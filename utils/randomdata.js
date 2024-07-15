const axios = require('axios');

function generateRandomLogin() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
    const length = Math.floor(Math.random() * (15 - 12 + 1)) + 12;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  
function generateRandomPassword() {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const allChars = lower + upper + numbers;
  const length = 8;
  let result = '';
    
  result += lower.charAt(Math.floor(Math.random() * lower.length));
  result += upper.charAt(Math.floor(Math.random() * upper.length));
  result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  
  for (let i = 3; i < length; i++) {
    result += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    return result;
  }
  
function generateRandomName() {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const length = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
  let result = characters.charAt(Math.floor(Math.random() * characters.length)).toUpperCase();
    
  for (let i = 1; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  async function generateEmail() {
    const API_KEY = '9451c980-67cd-4e9e-8227-1de8c80ea945';
    const NAMESPACE = 'ldrqc';
    const tag = Math.random().toString(36).substring(2, 11);

    try {
        const email = `${NAMESPACE}.${tag}@inbox.testmail.app`;
        return email;
    } catch (error) {
        throw new Error(`Error generating email: ${error.message}`);
    }
  
  // function generateRandomEmail() {
  //   const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  //   const length = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
  //   let result = '';
    
  //   for (let i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * characters.length));
  //   }
  
  //   result += '@inbox.testmail.app';
  //   return result;
  // }

  // async function generateEmail() {
  //   const API_KEY = '9451c980-67cd-4e9e-8227-1de8c80ea945';
  //   const NAMESPACE = 'ldrqc';
  
  //   try {
  //     const response = await axios.get('https://api.testmail.app/api/json', {
  //       params: {
  //         apikey: API_KEY,
  //         namespace: NAMESPACE,
  //         pretty: true
  //       }
  //     });
  
  //     if (response.data.result === 'success') {
  //       const email = `random-${Math.random().toString(36).substring(2, 11)}@${NAMESPACE}.testmail.app`;
  //       return email;
  //     } else {
  //       throw new Error(`Failed to generate email: ${response.data.message}`);
  //     }
  //   } catch (error) {
  //     throw new Error(`Error generating email: ${error.message}`);
  //   }
  }
  
  module.exports = { generateRandomLogin, generateRandomPassword, generateRandomName, generateEmail };