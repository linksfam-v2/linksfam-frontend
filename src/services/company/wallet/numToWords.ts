//function to convert number to words

const singleDigits = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const twoDigits = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const tensMultiple = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];


export function convertToWords(num: number): string {
    if (num === 0) return 'zero';
    
    // Handle negative numbers
    if (num < 0) return 'minus ' + convertToWords(Math.abs(num));
    
    let words = '';
    
    // Handle Crores
    if (num >= 10000000) {
        words += convertToWords(Math.floor(num / 10000000)) + ' crore ';
        num %= 10000000;
    }
    
    // Handle Lakhs
    if (num >= 100000) {
        words += convertToWords(Math.floor(num / 100000)) + ' lakh ';
        num %= 100000;
    }
    
    // Handle Thousands
    if (num >= 1000) {
        words += convertToWords(Math.floor(num / 1000)) + ' thousand ';
        num %= 1000;
    }
    
    // Handle Hundreds
    if (num >= 100) {
        words += convertToWords(Math.floor(num / 100)) + ' hundred ';
        num %= 100;
    }
    
    if (num > 0) {
        // Handle 11-19 separately
        if (num >= 10 && num < 20) {  // Changed condition from (num < 20)
            words += twoDigits[num - 10];
        } else {
            // Handle remaining 2-digit numbers
            words += tensMultiple[Math.floor(num / 10)];
            if (num % 10 > 0) {
                words += ' ' + singleDigits[num % 10];
            }
        }
    }
    
    return words.trim();
}
