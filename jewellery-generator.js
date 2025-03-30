// Jewelry Store Mock Data Generator
// Generates realistic sales data for a jewelry store for 2024

// Constants
const JEWELRY_ITEMS = {
    'Ring': { minWeight: 1, maxWeight: 7 },
    'Necklace': { minWeight: 3, maxWeight: 15 },
    'Bracelet': { minWeight: 3, maxWeight: 28 },
    'Earrings': { minWeight: 1, maxWeight: 3 },
    'Chain': { minWeight: 8, maxWeight: 30 },
    'Pendant': { minWeight: 2, maxWeight: 12 }
  };
  
  const METAL_PRICES = {
    '9kt Gold': 27.5,
    '14kt Gold': 42.9,
    '18kt Gold': 55.1,
    '22kt Gold': 67.4,
    '24kt Gold': 73.6,
    'Silver': 0.85
  };
  
  const METAL_MARKUP = {
    'Gold': 1.5,
    'Silver': 3
  };
  
  const PAYMENT_METHODS = ['Cash', 'Card'];
  
  const SALES_ASSOCIATES = [
    { name: 'Habib', salesSkill: 0.95, discountSkill: 0.85, upsellSkill: 0.9 },
    { name: 'Olivia', salesSkill: 0.8, discountSkill: 0.9, upsellSkill: 0.85 },
    { name: 'Joseph', salesSkill: 0.85, discountSkill: 0.8, upsellSkill: 0.95 },
    { name: 'Chilli', salesSkill: 0.9, discountSkill: 0.95, upsellSkill: 0.8 }
  ];
  
  // UK Public Holidays 2024
  const UK_HOLIDAYS_2024 = [
    new Date(2024, 0, 1),   // New Year's Day
    new Date(2024, 2, 29),  // Good Friday
    new Date(2024, 3, 1),   // Easter Monday
    new Date(2024, 4, 6),   // Early May Bank Holiday
    new Date(2024, 4, 27),  // Spring Bank Holiday
    new Date(2024, 7, 26),  // Summer Bank Holiday
    new Date(2024, 11, 25), // Christmas Day
    new Date(2024, 11, 26)  // Boxing Day
  ];
  
  // Special events that boost sales
  const SPECIAL_EVENTS = [
    { name: 'Valentine\'s Day', date: new Date(2024, 1, 14), boost: 2.0, goldBoost: 2.5 },
    { name: 'Mother\'s Day', date: new Date(2024, 2, 10), boost: 1.8, goldBoost: 2.0 },
    { name: 'Father\'s Day', date: new Date(2024, 5, 16), boost: 1.5, goldBoost: 1.8 },
    { name: 'Black Friday', date: new Date(2024, 10, 29), boost: 2.2, goldBoost: 2.2 },
    { name: 'Christmas Eve', date: new Date(2024, 11, 24), boost: 2.5, goldBoost: 3.0 },
    { name: 'Boxing Day Sale', date: new Date(2024, 11, 27), boost: 1.7, goldBoost: 1.5 }
  ];
  
  // Pay days (end/beginning of month) - assume 28th and 1st of each month
  const PAY_DAYS = [];
  for (let month = 0; month < 12; month++) {
    PAY_DAYS.push(new Date(2024, month, 1));  // First of month
    PAY_DAYS.push(new Date(2024, month, 28)); // 28th of month
  }
  
  // Revenue cap
  const REVENUE_CAP = 600000;
  
  // Helper Functions
  
  // Check if a date is a Sunday
  function isSunday(date) {
    return date.getDay() === 0;
  }
  
  // Check if a date is a UK holiday
  function isHoliday(date) {
    return UK_HOLIDAYS_2024.some(holiday => 
      holiday.getDate() === date.getDate() && 
      holiday.getMonth() === date.getMonth());
  }
  
  // Check if a date is a trading day
  function isTradingDay(date) {
    return !isSunday(date) && !isHoliday(date);
  }
  
  // Calculate sales boost based on proximity to special events and pay days
  function calculateSalesBoost(date) {
    let boost = 1.0;
    
    // Special events boost
    for (const event of SPECIAL_EVENTS) {
      const daysDifference = Math.abs((date - event.date) / (1000 * 60 * 60 * 24));
      if (daysDifference === 0) {
        boost *= event.boost;
      } else if (daysDifference <= 3) {
        boost *= 1 + ((event.boost - 1) * (1 - daysDifference/4));
      }
    }
    
    // Pay day boost
    for (const payDay of PAY_DAYS) {
      const daysDifference = Math.abs((date - payDay) / (1000 * 60 * 60 * 24));
      if (daysDifference <= 3) {
        boost *= 1.3 - (daysDifference * 0.1);
      }
    }
    
    // Seasonal adjustments
    const month = date.getMonth();
    if (month === 11) { // December - Christmas season
      boost *= 1.5;
    } else if (month === 1) { // February - Valentine's
      boost *= 1.3;
    } else if (month === 5 || month === 6 || month === 7) { // Summer months
      boost *= 1.2;
    }
    
    return boost;
  }
  
  // Calculate gold probability based on special events
  function calculateGoldProbability(date) {
    // Base probability is low
    let probability = 0.15;
    
    // Check proximity to special events
    for (const event of SPECIAL_EVENTS) {
      const daysDifference = Math.abs((date - event.date) / (1000 * 60 * 60 * 24));
      if (daysDifference === 0) {
        probability = Math.min(probability * event.goldBoost, 0.6);
      } else if (daysDifference <= 5) {
        probability = Math.min(probability * (1 + ((event.goldBoost - 1) * (1 - daysDifference/6))), 0.5);
      }
    }
    
    // Higher probability during December (Christmas season)
    if (date.getMonth() === 11) {
      probability *= 1.3;
    }
    
    // Higher probability on pay days
    for (const payDay of PAY_DAYS) {
      const daysDifference = Math.abs((date - payDay) / (1000 * 60 * 60 * 24));
      if (daysDifference <= 2) {
        probability *= 1.2;
      }
    }
    
    return Math.min(probability, 0.6); // Cap at 60%
  }
  
  // Generate a random number within a range
  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Generate a random integer within a range
  function randomInt(min, max) {
    return Math.floor(randomNumber(min, max + 1));
  }
  
  // Choose a random item from an array
  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // Generate a weighted random age between 18-75 with most common being 30-55
  function generateAge() {
    // Use a bell curve-like distribution centered around 42.5 (midpoint of 30-55)
    const u1 = 1 - Math.random(); // Convert [0,1) to (0,1]
    const u2 = 1 - Math.random();
    const randStdNormal = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    const randNormal = 42.5 + randStdNormal * 10; // mean=42.5, std_dev=10
    
    // Clamp to our desired range
    return Math.min(Math.max(Math.round(randNormal), 18), 75);
  }
  
  // Create customer database
  function generateCustomers(count) {
    const customers = [];
    const genders = ['Male', 'Female', 'Non-binary', 'Prefer not to say'];
    
    for (let i = 1; i <= count; i++) {
      customers.push({
        id: `CUST${i.toString().padStart(5, '0')}`,
        age: generateAge(),
        gender: randomChoice(genders),
        preferredItems: [randomChoice(Object.keys(JEWELRY_ITEMS)), randomChoice(Object.keys(JEWELRY_ITEMS))],
        preferredMetal: Math.random() < 0.2 ? randomChoice(Object.keys(METAL_PRICES).filter(m => m.includes('Gold'))) : 'Silver',
        loyaltyLevel: randomNumber(0, 1) // 0=new customer, 1=very loyal
      });
    }
    
    return customers;
  }
  
  // Generate a single transaction
  function generateTransaction(date, transactionId, customers, goldAllowed) {
    const customer = randomChoice(customers);
    const loyaltyFactor = 0.2 + (customer.loyaltyLevel * 0.8); // Loyal customers more likely to buy
    
    // Pick sales associate - better performers slightly more likely on busy days
    const boostFactor = calculateSalesBoost(date);
    const associate = SALES_ASSOCIATES.sort(() => boostFactor > 1.5 ? Math.random() - 0.3 : Math.random() - 0.5)[0];
    
    // Item selection - influenced by customer preferences
    let itemType = Math.random() < 0.6 ? 
      randomChoice(customer.preferredItems) : 
      randomChoice(Object.keys(JEWELRY_ITEMS));
    
    // Metal selection - with preference for silver
    let metalBase;
    if (goldAllowed) {
      // Choose gold with probability based on event proximity
      const goldProb = calculateGoldProbability(date);
      metalBase = Math.random() < goldProb ? 
        randomChoice(Object.keys(METAL_PRICES).filter(m => m.includes('Gold'))) : 
        'Silver';
    } else {
      metalBase = 'Silver';
    }
    
    // Upselling by sales associate (only for gold)
    if (metalBase.includes('Gold') && Math.random() < associate.upsellSkill) {
      const goldTypes = ['9kt Gold', '14kt Gold', '18kt Gold', '22kt Gold', '24kt Gold'];
      const currentIndex = goldTypes.indexOf(metalBase);
      if (currentIndex < goldTypes.length - 1) {
        metalBase = goldTypes[currentIndex + 1];
      }
    }
    
    const itemWeight = randomNumber(
      JEWELRY_ITEMS[itemType].minWeight,
      JEWELRY_ITEMS[itemType].maxWeight
    );
    
    const metalType = metalBase.includes('Gold') ? 'Gold' : 'Silver';
    const basePrice = METAL_PRICES[metalBase] * itemWeight;
    const markupPrice = basePrice * METAL_MARKUP[metalType];
    
    // Discount influenced by sales associate and loyalty
    const maxDiscount = Math.min(20, 5 + (15 * (1 - associate.discountSkill)));
    const minDiscount = 5 * loyaltyFactor;
    const discountPercentage = randomNumber(minDiscount, maxDiscount);
    const discountAmount = (markupPrice * discountPercentage) / 100;
    
    const totalSaleValue = markupPrice - discountAmount;
    const quantity = Math.random() < 0.8 ? 1 : randomInt(1, 3);
    
    // Generate a time between 9AM and 7PM
    const hour = randomInt(9, 19);
    const minute = randomInt(0, 59);
    const second = randomInt(0, 59);
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
    
    return {
      TransactionID: transactionId,
      Date: date.toISOString().split('T')[0],
      Time: time,
      ItemSold: itemType,
      QuantitySold: quantity,
      SalePrice: basePrice.toFixed(2),
      Weight: itemWeight.toFixed(2),
      MetalType: metalBase,
      DiscountApplied: discountAmount.toFixed(2),
      TotalSaleValue: (totalSaleValue * quantity).toFixed(2),
      PaymentMethod: randomChoice(PAYMENT_METHODS),
      CustomerID: customer.id,
      Age: customer.age,
      Gender: customer.gender,
      SalesAssociate: associate.name,
      MarkupPrice: markupPrice.toFixed(2)
    };
  }
  
  // Main function to generate the complete dataset
  function generateJewelryDataset() {
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 11, 31);
    const transactions = [];
    let transactionCounter = 1;
    let totalRevenue = 0;
    
    // Generate 500 customers
    const customers = generateCustomers(500);
    
    // Calculate total trading days in the year
    let tradingDayCount = 0;
    let currentDateCount = new Date(startDate);
    while (currentDateCount <= endDate) {
      if (isTradingDay(currentDateCount)) {
        tradingDayCount++;
      }
      currentDateCount.setDate(currentDateCount.getDate() + 1);
    }
    
    // Average revenue per trading day to meet cap
    const avgRevenuePerDay = REVENUE_CAP / tradingDayCount;
    
    // Iterate through each day of 2024
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (isTradingDay(currentDate)) {
        const salesBoost = calculateSalesBoost(currentDate);
        
        // Determine target revenue for this day based on the boost factor
        const dayTargetRevenue = avgRevenuePerDay * salesBoost;
        
        // Determine baseline number of transactions based on boost
        let baseSales = Math.max(10, Math.min(Math.round(randomInt(15, 30) * salesBoost), 50));
        
        // Count gold sales for the day
        let goldSalesCount = 0;
        let maxGoldSales = salesBoost > 1.5 ? 3 : (salesBoost > 1.2 ? 2 : 1);
        
        // Daily revenue tracker
        let dailyRevenue = 0;
        
        // Generate transactions for this day
        for (let i = 0; i < baseSales; i++) {
          // Determine if this can be a gold sale
          const canBeGold = goldSalesCount < maxGoldSales;
          
          const transaction = generateTransaction(
            currentDate, 
            `TRX${transactionCounter.toString().padStart(6, '0')}`,
            customers,
            canBeGold
          );
          
          const saleValue = parseFloat(transaction.TotalSaleValue);
          
          // Track gold sales
          if (transaction.MetalType.includes('Gold')) {
            goldSalesCount++;
          }
          
          // Add transaction if we're within limits
          if (totalRevenue + saleValue <= REVENUE_CAP && dailyRevenue < dayTargetRevenue) {
            transactions.push(transaction);
            totalRevenue += saleValue;
            dailyRevenue += saleValue;
            transactionCounter++;
          }
          
          // If we reach the revenue cap, stop
          if (totalRevenue >= REVENUE_CAP) {
            break;
          }
        }
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Stop if we hit the revenue cap
      if (totalRevenue >= REVENUE_CAP) {
        break;
      }
    }
    
    return {
      transactions,
      totalRevenue: totalRevenue.toFixed(2),
      transactionCount: transactions.length,
      tradingDays: tradingDayCount
    };
  }
  
  // Generate the data
  const jewelryData = generateJewelryDataset();
  console.log(`Generated ${jewelryData.transactionCount} transactions across ${jewelryData.tradingDays} trading days`);
  console.log(`Total Revenue: £${jewelryData.totalRevenue}`);
  
  // Monthly statistics removed - will be done in SQL instead
  
  // Export to CSV
  function exportToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle values with commas by enclosing in quotes
        return `"${value}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  }
  
  const csvData = exportToCSV(jewelryData.transactions);
  
  // For Node.js environment:
  require('fs').writeFileSync('jewelry_sales_2024.csv', csvData);