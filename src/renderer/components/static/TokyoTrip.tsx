import React from 'react';
import {
  VStack,
  HStack,
  Box,
  Text,
  Card,
  CardBody,
  Badge,
  Grid,
  GridItem,
  Divider,
  AspectRatio,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface DayActivity {
  time: string;
  title: string;
  location: string;
  description: string;
  type: 'food' | 'culture' | 'shopping' | 'transport';
}

const itinerary: { day: string; activities: DayActivity[] }[] = [
  {
    day: "Friday",
    activities: [
      { time: "9:00 AM", title: "Arrival at Haneda Airport", location: "Tokyo Haneda", description: "Land and take the monorail to central Tokyo", type: "transport" },
      { time: "11:00 AM", title: "Check-in at Hotel", location: "Shibuya", description: "Drop off luggage and freshen up", type: "transport" },
      { time: "1:00 PM", title: "Lunch at Ichiran Ramen", location: "Shibuya", description: "Famous tonkotsu ramen in individual booths", type: "food" },
      { time: "3:00 PM", title: "Explore Shibuya Crossing", location: "Shibuya", description: "Experience the world's busiest intersection", type: "culture" },
      { time: "6:00 PM", title: "Dinner in Golden Gai", location: "Shinjuku", description: "Tiny bars and local atmosphere", type: "food" },
    ]
  },
  {
    day: "Saturday", 
    activities: [
      { time: "8:00 AM", title: "Visit Senso-ji Temple", location: "Asakusa", description: "Tokyo's oldest temple with traditional architecture", type: "culture" },
      { time: "10:30 AM", title: "Nakamise Shopping Street", location: "Asakusa", description: "Traditional snacks and souvenirs", type: "shopping" },
      { time: "1:00 PM", title: "Sushi at Tsukiji Outer Market", location: "Tsukiji", description: "Fresh sushi and street food", type: "food" },
      { time: "3:30 PM", title: "TeamLab Borderless", location: "Odaiba", description: "Interactive digital art museum", type: "culture" },
      { time: "7:00 PM", title: "Dinner in Ginza", location: "Ginza", description: "Upscale dining experience", type: "food" },
    ]
  },
  {
    day: "Sunday",
    activities: [
      { time: "9:00 AM", title: "Meiji Shrine", location: "Harajuku", description: "Peaceful shrine in the city center", type: "culture" },
      { time: "11:00 AM", title: "Harajuku & Takeshita Street", location: "Harajuku", description: "Youth culture and quirky fashion", type: "shopping" },
      { time: "2:00 PM", title: "Lunch in Omotesando", location: "Omotesando", description: "Trendy cafes and restaurants", type: "food" },
      { time: "4:00 PM", title: "Departure preparations", location: "Hotel", description: "Pack and head to airport", type: "transport" },
    ]
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'food': return 'accent.pink';
    case 'culture': return 'accent.purple';
    case 'shopping': return 'accent.emerald';
    case 'transport': return 'brand.500';
    default: return 'gray.500';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'food': return '🍜';
    case 'culture': return '🏛️';
    case 'shopping': return '🛍️';
    case 'transport': return '🚊';
    default: return '📍';
  }
};

export const TokyoTrip: React.FC = () => {
  return (
    <VStack spacing={6} align="stretch" w="full" maxW="1000px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="2xl" fontWeight="600" color="gray.800">
            Tokyo Trip
          </Text>
          <Text fontSize="md" color="gray.600" fontWeight="400">
            3-day itinerary with must-see spots
          </Text>
        </VStack>
        <Badge colorScheme="purple" variant="subtle" px={3} py={1}>
          3 days
        </Badge>
      </HStack>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        {/* Itinerary */}
        <GridItem>
          <VStack spacing={4} align="stretch">
            {itinerary.map((day, dayIndex) => (
              <MotionCard
                key={day.day}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                bg="rgba(255, 255, 255, 0.8)"
                backdropFilter="blur(16px)"
                borderRadius="20px"
                border="1px solid rgba(0, 0, 0, 0.05)"
              >
                <CardBody p={6}>
                  <Text fontSize="xl" fontWeight="600" color="gray.800" mb={4}>
                    {day.day}
                  </Text>
                  <VStack spacing={4} align="stretch">
                    {day.activities.map((activity, actIndex) => (
                      <MotionBox
                        key={actIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: (dayIndex * 0.1) + (actIndex * 0.05) }}
                      >
                        <HStack spacing={4} align="start">
                          <VStack spacing={1} minW="80px" align="start">
                            <Text fontSize="sm" fontWeight="600" color="gray.700">
                              {activity.time}
                            </Text>
                            <Text fontSize="lg">
                              {getTypeIcon(activity.type)}
                            </Text>
                          </VStack>
                          <Box flex="1">
                            <VStack spacing={1} align="start">
                              <Text fontSize="md" fontWeight="600" color="gray.800">
                                {activity.title}
                              </Text>
                              <Text fontSize="sm" color={getTypeColor(activity.type)} fontWeight="500">
                                {activity.location}
                              </Text>
                              <Text fontSize="sm" color="gray.600" fontWeight="400">
                                {activity.description}
                              </Text>
                            </VStack>
                          </Box>
                        </HStack>
                        {actIndex < day.activities.length - 1 && (
                          <Divider mt={3} borderColor="gray.200" />
                        )}
                      </MotionBox>
                    ))}
                  </VStack>
                </CardBody>
              </MotionCard>
            ))}
          </VStack>
        </GridItem>

        {/* Map & Info */}
        <GridItem>
          <VStack spacing={4} align="stretch">
            {/* Map */}
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              bg="rgba(255, 255, 255, 0.8)"
              backdropFilter="blur(16px)"
              borderRadius="20px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <CardBody p={0}>
                <AspectRatio ratio={1} w="full">
                  <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=139.6917%2C35.6762%2C139.7672%2C35.7126&layer=mapnik&marker=35.6762%2C139.7294"
                    style={{
                      border: 'none',
                      borderRadius: '20px',
                      width: '100%',
                      height: '100%',
                    }}
                    title="Tokyo Map"
                  />
                </AspectRatio>
              </CardBody>
            </MotionCard>

            {/* Weather */}
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              bg="rgba(255, 255, 255, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="16px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <CardBody>
                <VStack spacing={3} align="start">
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    Weather
                  </Text>
                  <HStack justify="space-between" w="full">
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.600">Fri</Text>
                      <Text fontSize="lg">☀️</Text>
                      <Text fontSize="sm" fontWeight="500">22°C</Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.600">Sat</Text>
                      <Text fontSize="lg">⛅</Text>
                      <Text fontSize="sm" fontWeight="500">19°C</Text>
                    </VStack>
                    <VStack spacing={1}>
                      <Text fontSize="xs" color="gray.600">Sun</Text>
                      <Text fontSize="lg">☀️</Text>
                      <Text fontSize="sm" fontWeight="500">24°C</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </CardBody>
            </MotionCard>

            {/* Tips */}
            <MotionCard
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              bg="rgba(255, 255, 255, 0.7)"
              backdropFilter="blur(16px)"
              borderRadius="16px"
              border="1px solid rgba(0, 0, 0, 0.05)"
            >
              <CardBody>
                <VStack spacing={3} align="start">
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    Tips
                  </Text>
                  <VStack spacing={2} align="start" fontSize="sm" color="gray.700">
                    <Text>💳 Get a JR Pass for trains</Text>
                    <Text>📱 Download Google Translate</Text>
                    <Text>🍜 Bring cash for restaurants</Text>
                    <Text>🚇 Avoid rush hours (7-9, 5-7)</Text>
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