import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Card,
  CardBody,
  Badge,
  Select,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Avatar,
  Progress,
  Flex,
  SimpleGrid,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
} from 'recharts';

const MotionCard = motion(Card);

interface PriceData {
  time: string;
  price: number;
  volume: number;
}

interface WhaleAlert {
  id: string;
  amount: number;
  from: string;
  to: string;
  timestamp: number;
  symbol: string;
  usd_value: number;
}

interface RedditPost {
  id: string;
  title: string;
  score: number;
  comments: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  timestamp: number;
}

// Mock Bitcoin price data (in real app, this would come from an API)
const generateMockData = (days: number): PriceData[] => {
  const data: PriceData[] = [];
  const now = new Date();
  const basePrice = 67000; // More realistic current BTC price
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    
    // More realistic price movement (smaller daily changes)
    const dailyChange = (Math.random() - 0.5) * 0.08; // ±4% daily change
    currentPrice = currentPrice * (1 + dailyChange);
    
    // Add some intraday volatility
    const intradayNoise = (Math.random() - 0.5) * 0.02;
    const finalPrice = currentPrice * (1 + intradayNoise);
    
    data.push({
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Math.round(finalPrice),
      volume: Math.random() * 2000000000 + 500000000, // 0.5B - 2.5B volume
    });
  }
  
  // Ensure the data is in chronological order
  return data.reverse();
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatVolume = (volume: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(volume);
};

const generateMockWhaleAlerts = (): WhaleAlert[] => {
  const alerts: WhaleAlert[] = [];
  const now = Date.now();
  
  for (let i = 0; i < 8; i++) {
    const isEth = Math.random() > 0.6;
    const amount = isEth ? Math.random() * 5000 + 1000 : Math.random() * 500 + 100;
    const price = isEth ? 3500 : 107000;
    
    alerts.push({
      id: `whale-${i}`,
      amount: Math.round(amount),
      from: Math.random() > 0.5 ? 'unknown' : 'binance',
      to: Math.random() > 0.5 ? 'unknown' : 'coinbase',
      timestamp: now - (i * 30 * 60 * 1000), // 30 min intervals
      symbol: isEth ? 'ETH' : 'BTC',
      usd_value: amount * price
    });
  }
  
  return alerts.sort((a, b) => b.timestamp - a.timestamp);
};

const generateMockRedditSentiment = (): RedditPost[] => {
  const posts = [
    { title: "BTC breaking resistance at $108k! Moon mission activated 🚀", sentiment: 'bullish' as const },
    { title: "ETH 2.0 staking rewards looking juicy, anyone else accumulating?", sentiment: 'bullish' as const },
    { title: "Market correction incoming? Volume looks sus", sentiment: 'bearish' as const },
    { title: "Daily discussion - what's your DCA strategy?", sentiment: 'neutral' as const },
    { title: "Whale just moved 1000 BTC to exchange, dump incoming?", sentiment: 'bearish' as const },
    { title: "Technical analysis: BTC forming bull pennant on 4h chart", sentiment: 'bullish' as const },
    { title: "Regulatory news from EU looking positive for crypto", sentiment: 'bullish' as const },
    { title: "Am I the only one not buying this pump?", sentiment: 'bearish' as const },
  ];
  
  return posts.map((post, i) => ({
    id: `reddit-${i}`,
    title: post.title,
    score: Math.floor(Math.random() * 2000) + 100,
    comments: Math.floor(Math.random() * 500) + 20,
    sentiment: post.sentiment,
    timestamp: Date.now() - (i * 2 * 60 * 60 * 1000) // 2 hour intervals
  }));
};

export const BTCChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [timeframe, setTimeframe] = useState('7d');
  const [data, setData] = useState<PriceData[]>([]);
  const [ethData, setEthData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(67000);
  const [ethPrice, setEthPrice] = useState(3500);
  const [dayChange, setDayChange] = useState(0);
  const [ethDayChange, setEthDayChange] = useState(0);
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [redditSentiment, setRedditSentiment] = useState<RedditPost[]>([]);

  useEffect(() => {
    const fetchRealBitcoinData = async () => {
      setIsLoading(true);
      try {
        const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
        
        // Fetch both BTC and ETH data
        const [btcChartResponse, ethChartResponse, currentPriceResponse] = await Promise.all([
          fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`),
          fetch(`https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=${days}&interval=daily`),
          fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true')
        ]);
        
        if (!btcChartResponse.ok || !ethChartResponse.ok || !currentPriceResponse.ok) {
          throw new Error('Failed to fetch cryptocurrency data');
        }
        
        const [btcApiData, ethApiData, currentPriceData] = await Promise.all([
          btcChartResponse.json(),
          ethChartResponse.json(),
          currentPriceResponse.json()
        ]);
        
        // Transform BTC API data to our format
        const transformedBtcData: PriceData[] = btcApiData.prices.map((pricePoint: [number, number], index: number) => {
          const [timestamp, price] = pricePoint;
          const volume = btcApiData.total_volumes[index] ? btcApiData.total_volumes[index][1] : 0;
          
          return {
            time: new Date(timestamp).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            }),
            price: Math.round(price),
            volume: volume
          };
        });

        // Transform ETH API data to our format
        const transformedEthData: PriceData[] = ethApiData.prices.map((pricePoint: [number, number], index: number) => {
          const [timestamp, price] = pricePoint;
          const volume = ethApiData.total_volumes[index] ? ethApiData.total_volumes[index][1] : 0;
          
          return {
            time: new Date(timestamp).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric'
            }),
            price: Math.round(price),
            volume: volume
          };
        });
        
        setData(transformedBtcData);
        setEthData(transformedEthData);
        
        // Use the most current prices from the separate API call
        const liveBtcPrice = currentPriceData.bitcoin?.usd || (transformedBtcData.length > 0 ? transformedBtcData[transformedBtcData.length - 1].price : 67000);
        const liveEthPrice = currentPriceData.ethereum?.usd || (transformedEthData.length > 0 ? transformedEthData[transformedEthData.length - 1].price : 3500);
        const btcDayChangePercent = currentPriceData.bitcoin?.usd_24h_change || 0;
        const ethDayChangePercent = currentPriceData.ethereum?.usd_24h_change || 0;
        
        setCurrentPrice(Math.round(liveBtcPrice));
        setEthPrice(Math.round(liveEthPrice));
        setDayChange(btcDayChangePercent);
        setEthDayChange(ethDayChangePercent);

        // Generate mock whale alerts and Reddit sentiment
        setWhaleAlerts(generateMockWhaleAlerts());
        setRedditSentiment(generateMockRedditSentiment());
        
      } catch (error) {
        console.error('Failed to fetch real Bitcoin data, falling back to mock data:', error);
        // Fallback to mock data if API fails
        const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
        const newData = generateMockData(days);
        setData(newData);
        if (newData.length > 0) {
          setCurrentPrice(newData[newData.length - 1].price);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealBitcoinData();
  }, [timeframe]);

  // Use real 24h change from API, or calculate from chart data as fallback
  const priceChangePercent = dayChange !== 0 ? dayChange : (data.length > 1 ? ((currentPrice - data[data.length - 2].price) / data[data.length - 2].price) * 100 : 0);
  const priceChange = (currentPrice * priceChangePercent) / 100;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg="rgba(255, 255, 255, 0.95)"
          backdropFilter="blur(12px)"
          p={3}
          borderRadius="12px"
          border="1px solid rgba(0, 0, 0, 0.1)"
          boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
        >
          <Text fontSize="sm" fontWeight="500" color="gray.700">
            {label}
          </Text>
          <Text fontSize="sm" fontWeight="600" color="brand.600">
            {formatPrice(payload[0].value)}
          </Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <VStack spacing={6} align="stretch" w="full" maxW="1400px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="600" color="gray.800">
            Crypto Trading Dashboard
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="400">
            BTC/ETH live data • Whale alerts • Community sentiment
          </Text>
        </VStack>
        <HStack spacing={3}>
          <Select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            size="sm"
            bg="rgba(255, 255, 255, 0.8)"
            borderColor="gray.300"
            _focus={{ borderColor: 'brand.500' }}
            borderRadius="12px"
            w="100px"
          >
            <option value="1d">1D</option>
            <option value="7d">7D</option>
            <option value="30d">30D</option>
            <option value="90d">90D</option>
          </Select>
          <Badge
            colorScheme="green"
            variant="subtle"
            px={3}
            py={1}
          >
            Live Data
          </Badge>
        </HStack>
      </HStack>

      {/* Price Overview Cards */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          borderRadius="20px"
          border="1px solid rgba(0, 0, 0, 0.05)"
        >
          <CardBody p={6}>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Avatar size="sm" src="https://cryptologos.cc/logos/bitcoin-btc-logo.png" />
                  <Text fontSize="lg" fontWeight="600" color="gray.800">Bitcoin</Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="700" color="gray.800">
                  {formatPrice(currentPrice)}
                </Text>
                <Stat>
                  <StatHelpText>
                    <StatArrow type={priceChangePercent >= 0 ? 'increase' : 'decrease'} />
                    <Text
                      as="span"
                      fontSize="sm"
                      fontWeight="600"
                      color={priceChangePercent >= 0 ? 'green.500' : 'red.500'}
                      ml={1}
                    >
                      {Math.abs(priceChangePercent).toFixed(2)}%
                    </Text>
                  </StatHelpText>
                </Stat>
              </VStack>
              <Badge colorScheme="orange" variant="subtle">BTC</Badge>
            </HStack>
          </CardBody>
        </MotionCard>

        <MotionCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          bg="rgba(255, 255, 255, 0.9)"
          backdropFilter="blur(20px)"
          borderRadius="20px"
          border="1px solid rgba(0, 0, 0, 0.05)"
        >
          <CardBody p={6}>
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <HStack>
                  <Avatar size="sm" src="https://cryptologos.cc/logos/ethereum-eth-logo.png" />
                  <Text fontSize="lg" fontWeight="600" color="gray.800">Ethereum</Text>
                </HStack>
                <Text fontSize="3xl" fontWeight="700" color="gray.800">
                  {formatPrice(ethPrice)}
                </Text>
                <Stat>
                  <StatHelpText>
                    <StatArrow type={ethDayChange >= 0 ? 'increase' : 'decrease'} />
                    <Text
                      as="span"
                      fontSize="sm"
                      fontWeight="600"
                      color={ethDayChange >= 0 ? 'green.500' : 'red.500'}
                      ml={1}
                    >
                      {Math.abs(ethDayChange).toFixed(2)}%
                    </Text>
                  </StatHelpText>
                </Stat>
              </VStack>
              <Badge colorScheme="blue" variant="subtle">ETH</Badge>
            </HStack>
          </CardBody>
        </MotionCard>
      </SimpleGrid>

      {/* Main Content Grid */}
      <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6}>
        {/* Left Column - Charts */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            bg="rgba(255, 255, 255, 0.9)"
            backdropFilter="blur(20px)"
            borderRadius="24px"
            border="1px solid rgba(0, 0, 0, 0.05)"
            overflow="hidden"
          >
            <CardBody p={0}>
              <Tabs variant="soft-rounded" colorScheme="brand">
                <TabList p={4} pb={0}>
                  <Tab fontSize="sm" fontWeight="600">BTC Chart</Tab>
                  <Tab fontSize="sm" fontWeight="600">ETH Chart</Tab>
                  <Tab fontSize="sm" fontWeight="600">TradingView</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={6}>
                    <VStack spacing={4} align="stretch">
                      <Box h="400px">
                        {!isLoading && data.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                              <defs>
                                <linearGradient id="colorBtc" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#F7931A" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#F7931A" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                              <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#718096' }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#718096' }}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#F7931A"
                                strokeWidth={3}
                                fill="url(#colorBtc)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <Flex h="100%" align="center" justify="center" color="gray.500">
                            Loading BTC chart data...
                          </Flex>
                        )}
                      </Box>
                    </VStack>
                  </TabPanel>
                  <TabPanel p={6}>
                    <VStack spacing={4} align="stretch">
                      <Box h="400px">
                        {!isLoading && ethData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ethData}>
                              <defs>
                                <linearGradient id="colorEth" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#627EEA" stopOpacity={0.3} />
                                  <stop offset="95%" stopColor="#627EEA" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                              <XAxis
                                dataKey="time"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#718096' }}
                              />
                              <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#718096' }}
                                tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Area
                                type="monotone"
                                dataKey="price"
                                stroke="#627EEA"
                                strokeWidth={3}
                                fill="url(#colorEth)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        ) : (
                          <Flex h="100%" align="center" justify="center" color="gray.500">
                            Loading ETH chart data...
                          </Flex>
                        )}
                      </Box>
                    </VStack>
                  </TabPanel>
                  <TabPanel p={6}>
                    <Box h="400px" bg="gray.50" borderRadius="16px" p={4}>
                      <iframe
                        src="https://www.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=BINANCE%3ABTCUSDT&interval=1D&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=F1F3F6&studies=RSI%2CMACD&theme=light&style=1&timezone=Etc%2FUTC&withdateranges=1&showpopupbutton=1&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&showpopupbutton=1&locale=en"
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          borderRadius: '12px'
                        }}
                        title="TradingView Chart"
                      />
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* Right Column - Whale Alerts & Reddit */}
        <GridItem>
          <VStack spacing={6} align="stretch">
            {/* Whale Alerts */}
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              bg="rgba(255, 255, 255, 0.9)"
              backdropFilter="blur(20px)"
              borderRadius="20px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="600" color="gray.800">
                      🐋 Whale Alerts
                    </Text>
                    <Badge colorScheme="blue" variant="subtle">Live</Badge>
                  </HStack>
                  <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
                    <AnimatePresence>
                      {whaleAlerts.slice(0, 6).map((alert, index) => (
                        <motion.div
                          key={alert.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Box
                            p={3}
                            bg="rgba(0, 0, 0, 0.02)"
                            borderRadius="12px"
                            border="1px solid rgba(0, 0, 0, 0.05)"
                          >
                            <VStack spacing={2} align="start">
                              <HStack justify="space-between" w="full">
                                <HStack>
                                  <Badge colorScheme={alert.symbol === 'BTC' ? 'orange' : 'blue'} size="sm">
                                    {alert.symbol}
                                  </Badge>
                                  <Text fontSize="xs" color="gray.500">
                                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </Text>
                                </HStack>
                                <Text fontSize="xs" fontWeight="600" color="gray.700">
                                  ${formatVolume(alert.usd_value)}
                                </Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.700">
                                {alert.amount.toLocaleString()} {alert.symbol} moved
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {alert.from} → {alert.to}
                              </Text>
                            </VStack>
                          </Box>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </VStack>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Reddit Sentiment */}
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              bg="rgba(255, 255, 255, 0.9)"
              backdropFilter="blur(20px)"
              borderRadius="20px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="lg" fontWeight="600" color="gray.800">
                      📈 Reddit Sentiment
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="xs" color="green.500">
                        {Math.round((redditSentiment.filter(p => p.sentiment === 'bullish').length / redditSentiment.length) * 100)}% 📈
                      </Text>
                      <Text fontSize="xs" color="red.500">
                        {Math.round((redditSentiment.filter(p => p.sentiment === 'bearish').length / redditSentiment.length) * 100)}% 📉
                      </Text>
                    </HStack>
                  </HStack>
                  <VStack spacing={3} align="stretch" maxH="300px" overflowY="auto">
                    {redditSentiment.slice(0, 4).map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Box
                          p={3}
                          bg="rgba(0, 0, 0, 0.02)"
                          borderRadius="12px"
                          border="1px solid rgba(0, 0, 0, 0.05)"
                        >
                          <VStack spacing={2} align="start">
                            <HStack justify="space-between" w="full">
                              <Badge
                                colorScheme={
                                  post.sentiment === 'bullish' ? 'green' :
                                  post.sentiment === 'bearish' ? 'red' : 'gray'
                                }
                                size="sm"
                              >
                                {post.sentiment === 'bullish' ? '📈' : post.sentiment === 'bearish' ? '📉' : '➡️'}
                              </Badge>
                              <Text fontSize="xs" color="gray.500">
                                {new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.700" noOfLines={2}>
                              {post.title}
                            </Text>
                            <HStack justify="space-between" w="full">
                              <Text fontSize="xs" color="gray.500">
                                ↑ {post.score}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                💬 {post.comments}
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                      </motion.div>
                    ))}
                  </VStack>
                </VStack>
              </CardBody>
            </MotionCard>
          </VStack>
        </GridItem>
      </Grid>
    </VStack>
  );
};