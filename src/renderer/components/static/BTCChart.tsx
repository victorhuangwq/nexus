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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
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
} from 'recharts';

const MotionCard = motion(Card);

interface PriceData {
  time: string;
  price: number;
  volume: number;
}

// Mock Bitcoin price data (in real app, this would come from an API)
const generateMockData = (days: number): PriceData[] => {
  const data: PriceData[] = [];
  const now = new Date();
  const basePrice = 45000;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const randomChange = (Math.random() - 0.5) * 0.1; // ±5% daily change
    const price = Math.round(basePrice * (1 + randomChange * (i / days)));
    
    data.push({
      time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: price + Math.random() * 2000 - 1000,
      volume: Math.random() * 1000000000,
    });
  }
  
  return data;
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

export const BTCChart: React.FC = () => {
  const [timeframe, setTimeframe] = useState('7d');
  const [data, setData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const days = timeframe === '1d' ? 1 : timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      setData(generateMockData(days));
      setIsLoading(false);
    }, 500);
  }, [timeframe]);

  const currentPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const previousPrice = data.length > 1 ? data[data.length - 2].price : currentPrice;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

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
    <VStack spacing={6} align="stretch" w="full" maxW="1000px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="600" color="gray.800">
            Bitcoin Chart
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="400">
            Live price and market data
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
            colorScheme={priceChange >= 0 ? 'green' : 'red'}
            variant="subtle"
            px={3}
            py={1}
          >
            Live
          </Badge>
        </HStack>
      </HStack>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Chart */}
        <GridItem>
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            bg="rgba(255, 255, 255, 0.8)"
            backdropFilter="blur(16px)"
            borderRadius="24px"
            border="1px solid rgba(0, 0, 0, 0.05)"
            overflow="hidden"
          >
            <CardBody p={6}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontSize="3xl" fontWeight="700" color="gray.800">
                      {formatPrice(currentPrice)}
                    </Text>
                    <HStack>
                      <StatArrow type={priceChange >= 0 ? 'increase' : 'decrease'} />
                      <Text
                        fontSize="sm"
                        fontWeight="600"
                        color={priceChange >= 0 ? 'green.500' : 'red.500'}
                      >
                        {formatPrice(Math.abs(priceChange))} ({Math.abs(priceChangePercent).toFixed(2)}%)
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                <Box h="300px">
                  {!isLoading && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
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
                          stroke="#0EA5E9"
                          strokeWidth={3}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box
                      h="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="gray.500"
                    >
                      Loading chart data...
                    </Box>
                  )}
                </Box>
              </VStack>
            </CardBody>
          </MotionCard>
        </GridItem>

        {/* Stats & Info */}
        <GridItem>
          <VStack spacing={4} align="stretch">
            {/* Market Stats */}
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              bg="rgba(255, 255, 255, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="20px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <CardBody>
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    Market Data
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <Stat>
                      <StatLabel fontSize="xs" color="gray.600">24h High</StatLabel>
                      <StatNumber fontSize="md" color="gray.800">
                        {formatPrice(currentPrice * 1.05)}
                      </StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel fontSize="xs" color="gray.600">24h Low</StatLabel>
                      <StatNumber fontSize="md" color="gray.800">
                        {formatPrice(currentPrice * 0.95)}
                      </StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel fontSize="xs" color="gray.600">Volume</StatLabel>
                      <StatNumber fontSize="md" color="gray.800">
                        ${formatVolume(data.length > 0 ? data[data.length - 1].volume : 0)}
                      </StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel fontSize="xs" color="gray.600">Market Cap</StatLabel>
                      <StatNumber fontSize="md" color="gray.800">
                        $845.2B
                      </StatNumber>
                    </Stat>
                  </VStack>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Quick Actions */}
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              bg="rgba(255, 255, 255, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="16px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <CardBody>
                <VStack spacing={3} align="start">
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    Info
                  </Text>
                  <VStack spacing={2} align="start" fontSize="sm" color="gray.700">
                    <Text>📈 All-time high: $69,000</Text>
                    <Text>⏰ Updated: Just now</Text>
                    <Text>🏆 Rank #1 by market cap</Text>
                    <Text>💎 19.8M BTC in circulation</Text>
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