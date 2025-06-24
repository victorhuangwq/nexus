import React, { useState } from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Card,
  CardBody,
  Badge,
  Input,
  Button,
  AspectRatio,
  Select,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

export const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState('Tokyo');
  const [unit, setUnit] = useState('metric');

  const getWeatherUrl = () => {
    const unitParam = unit === 'metric' ? 'M' : 'F';
    return `https://wttr.in/${encodeURIComponent(city)}?format=v2&${unitParam}&T&Q&F&lang=en`;
  };

  const handleCityChange = (newCity: string) => {
    if (newCity.trim()) {
      setCity(newCity.trim());
    }
  };

  return (
    <VStack spacing={6} align="stretch" w="full" maxW="800px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="600" color="gray.800">
            Weather
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="400">
            Live weather data for any city
          </Text>
        </VStack>
        <Badge colorScheme="blue" variant="subtle" px={3} py={1}>
          Live
        </Badge>
      </HStack>

      {/* Controls */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(16px)"
        borderRadius="20px"
        border="1px solid rgba(0, 0, 0, 0.05)"
      >
        <CardBody p={6}>
          <HStack spacing={4}>
            <VStack align="start" spacing={2} flex="1">
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                City
              </Text>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCityChange(city)}
                placeholder="Enter city name"
                size="md"
                bg="rgba(255, 255, 255, 0.9)"
                borderColor="gray.300"
                _focus={{ borderColor: 'brand.500' }}
                borderRadius="12px"
              />
            </VStack>
            <VStack align="start" spacing={2}>
              <Text fontSize="sm" fontWeight="500" color="gray.700">
                Units
              </Text>
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                size="md"
                bg="rgba(255, 255, 255, 0.9)"
                borderColor="gray.300"
                _focus={{ borderColor: 'brand.500' }}
                borderRadius="12px"
                w="120px"
              >
                <option value="metric">Celsius</option>
                <option value="imperial">Fahrenheit</option>
              </Select>
            </VStack>
            <VStack align="end" spacing={2}>
              <Text fontSize="sm" color="transparent">
                Action
              </Text>
              <Button
                onClick={() => handleCityChange(city)}
                variant="clean"
                size="md"
                borderRadius="12px"
                minW="80px"
              >
                Update
              </Button>
            </VStack>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Weather Display */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        bg="rgba(255, 255, 255, 0.8)"
        backdropFilter="blur(16px)"
        borderRadius="24px"
        border="1px solid rgba(0, 0, 0, 0.05)"
      >
        <CardBody p={0}>
          <VStack spacing={0}>
            <Box p={6} w="full">
              <Text fontSize="xl" fontWeight="600" color="gray.800" textAlign="center">
                {city} Weather Forecast
              </Text>
            </Box>
            <AspectRatio ratio={16/14} w="full">
              <iframe
                key={`${city}-${unit}`}
                src={getWeatherUrl()}
                style={{
                  border: 'none',
                  borderRadius: '0 0 24px 24px',
                  width: '100%',
                  height: '100%',
                  background: 'white',
                }}
                title={`${city} Weather Forecast`}
                loading="lazy"
              />
            </AspectRatio>
          </VStack>
        </CardBody>
      </MotionCard>

      {/* Quick City Buttons */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        bg="rgba(255, 255, 255, 0.7)"
        backdropFilter="blur(16px)"
        borderRadius="16px"
        border="1px solid rgba(0, 0, 0, 0.05)"
      >
        <CardBody>
          <VStack spacing={3} align="start">
            <Text fontSize="lg" fontWeight="600" color="gray.800">
              Popular Cities
            </Text>
            <HStack spacing={2} wrap="wrap">
              {['Tokyo', 'New York', 'London', 'Paris', 'Sydney', 'Dubai'].map((cityName) => (
                <Button
                  key={cityName}
                  onClick={() => handleCityChange(cityName)}
                  variant="glass"
                  size="sm"
                  borderRadius="10px"
                  fontSize="sm"
                  _hover={{
                    transform: 'translateY(-1px)',
                  }}
                >
                  {cityName}
                </Button>
              ))}
            </HStack>
          </VStack>
        </CardBody>
      </MotionCard>
    </VStack>
  );
};