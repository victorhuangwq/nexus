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
import { tokens } from '../../design-tokens';

const MotionCard = motion(Card);

export const WeatherWidget: React.FC = () => {
  const [city, setCity] = useState('Tokyo');
  const [unit, setUnit] = useState('metric');

  const getWeatherUrl = () => {
    // Use windy.com for better weather visualization
    const coordinates = getCoordinates(city);
    return `https://embed.windy.com/embed2.html?lat=${coordinates.lat}&lon=${coordinates.lon}&detailLat=${coordinates.lat}&detailLon=${coordinates.lon}&width=650&height=450&zoom=8&level=surface&overlay=temp&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=${unit === 'metric' ? 'C' : 'F'}&radarRange=-1`;
  };

  const getCoordinates = (cityName: string) => {
    const cityCoords: { [key: string]: { lat: number; lon: number } } = {
      'Tokyo': { lat: 35.6762, lon: 139.6503 },
      'New York': { lat: 40.7128, lon: -74.0060 },
      'London': { lat: 51.5074, lon: -0.1278 },
      'Paris': { lat: 48.8566, lon: 2.3522 },
      'Sydney': { lat: -33.8688, lon: 151.2093 },
      'Dubai': { lat: 25.2048, lon: 55.2708 },
      'Kyoto': { lat: 35.0116, lon: 135.7681 }
    };
    return cityCoords[cityName] || cityCoords['Tokyo'];
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
          <Text fontSize="2xl" fontWeight="600" color="white">
            Weather Radar
          </Text>
          <Text fontSize="md" color="rgba(255, 255, 255, 0.8)" fontWeight="400">
            Interactive weather maps powered by Windy
          </Text>
        </VStack>
        <Badge colorScheme="blue" variant="solid" px={3} py={1}>
          Live
        </Badge>
      </HStack>

      {/* Controls */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        bg={tokens.glass.light.background}
        backdropFilter={tokens.glass.light.blur}
        borderRadius={tokens.radius.xl}
        border={tokens.glass.light.border}
      >
        <CardBody p={tokens.space[3]}>
          <HStack spacing={tokens.space[2]} align="flex-end">
            <Box flex="1">
              <Text fontSize={tokens.typography.fontSize.sm} fontWeight={tokens.typography.fontWeight.medium} color={tokens.colors.text.secondary} mb={tokens.space[1]}>
                City
              </Text>
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCityChange(city)}
                placeholder="Enter city name"
                size="md"
                bg={tokens.glass.light.background}
                borderColor={tokens.colors.border.default}
                color={tokens.colors.text.primary}
                _hover={{ borderColor: tokens.colors.border.hover }}
                _focus={{ borderColor: tokens.colors.border.focus, boxShadow: tokens.shadow.focus }}
                borderRadius={tokens.radius.md}
              />
            </Box>
            <Box>
              <Text fontSize={tokens.typography.fontSize.sm} fontWeight={tokens.typography.fontWeight.medium} color={tokens.colors.text.secondary} mb={tokens.space[1]}>
                Units
              </Text>
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                size="md"
                bg={tokens.glass.light.background}
                borderColor={tokens.colors.border.default}
                color={tokens.colors.text.primary}
                _hover={{ borderColor: tokens.colors.border.hover }}
                _focus={{ borderColor: tokens.colors.border.focus, boxShadow: tokens.shadow.focus }}
                borderRadius={tokens.radius.md}
                w="140px"
              >
                <option value="metric">Celsius</option>
                <option value="imperial">Fahrenheit</option>
              </Select>
            </Box>
            <Button
              onClick={() => handleCityChange(city)}
              bg={tokens.colors.brand.primaryAlpha}
              color="rgba(0, 0, 0, 0.9)"
              size="md"
              borderRadius={tokens.radius.md}
              px={tokens.space[3]}
              fontWeight={tokens.typography.fontWeight.medium}
              _hover={{ bg: tokens.colors.brand.primaryHover, transform: 'translateY(-1px)' }}
              _active={{ transform: 'scale(0.98)' }}
              transition={`all ${tokens.transition.duration.fast}`}
            >
              Update
            </Button>
          </HStack>
        </CardBody>
      </MotionCard>

      {/* Weather Display */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        bg={tokens.glass.light.background}
        backdropFilter={tokens.glass.light.blur}
        borderRadius={tokens.radius['2xl']}
        border={tokens.glass.light.border}
      >
        <CardBody p={0}>
          <VStack spacing={0}>
            <Box p={6} w="full">
              <Text fontSize="xl" fontWeight="600" color="white" textAlign="center">
                {city} Live Weather Map
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
                title={`${city} Live Weather Map`}
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
        bg={tokens.glass.light.background}
        backdropFilter={tokens.glass.light.blur}
        borderRadius={tokens.radius.lg}
        border={tokens.glass.light.border}
      >
        <CardBody p={tokens.space[3]}>
          <VStack spacing={tokens.space[2]} align="start">
            <Text fontSize={tokens.typography.fontSize.lg} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
              Popular Cities
            </Text>
            <HStack spacing={tokens.space[1]} wrap="wrap">
              {['Tokyo', 'New York', 'London', 'Paris', 'Sydney', 'Dubai'].map((cityName) => (
                <Button
                  key={cityName}
                  onClick={() => handleCityChange(cityName)}
                  variant="ghost"
                  size="sm"
                  borderRadius={tokens.radius.md}
                  fontSize={tokens.typography.fontSize.sm}
                  color={tokens.colors.text.secondary}
                  border="1px solid"
                  borderColor={tokens.colors.border.default}
                  bg="transparent"
                  _hover={{
                    bg: tokens.glass.medium.background,
                    color: tokens.colors.text.primary,
                    borderColor: tokens.colors.border.hover,
                    transform: 'translateY(-1px)',
                  }}
                  transition={`all ${tokens.transition.duration.fast}`}
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