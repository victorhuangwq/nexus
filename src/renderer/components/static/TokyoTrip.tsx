import React, { useState } from 'react';
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
  AspectRatio,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../design-tokens';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

interface DayActivity {
  time: string;
  title: string;
  location: string;
  description: string;
  type: 'food' | 'culture' | 'shopping' | 'transport';
}

interface AirbnbListing {
  id: string;
  title: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
  neighborhood: string;
  image: string;
  amenities: string[];
}

interface RedditRamenPost {
  id: string;
  title: string;
  author: string;
  score: number;
  comments: number;
  content: string;
  timestamp: string;
  location: string;
}

const kyotoItinerary: { day: string; activities: DayActivity[] }[] = [
  {
    day: "Saturday",
    activities: [
      { time: "8:00 AM", title: "Arrival & Check-in", location: "Kyoto Station", description: "Take JR from Osaka/Tokyo, store luggage", type: "transport" },
      { time: "9:30 AM", title: "Kiyomizu-dera Temple", location: "Higashiyama", description: "Famous wooden temple with city views", type: "culture" },
      { time: "11:00 AM", title: "Sannenzaka & Ninenzaka", location: "Higashiyama", description: "Historic preserved streets with shops", type: "shopping" },
      { time: "1:00 PM", title: "Ramen at Ichiran Kyoto", location: "Kawaramachi", description: "Kyoto's famous tonkotsu ramen", type: "food" },
      { time: "3:00 PM", title: "Fushimi Inari Shrine", location: "Fushimi", description: "Thousands of vermillion torii gates", type: "culture" },
      { time: "6:00 PM", title: "Pontocho Alley Dinner", location: "Pontocho", description: "Traditional narrow dining alley", type: "food" },
    ]
  },
  {
    day: "Sunday", 
    activities: [
      { time: "8:00 AM", title: "Arashiyama Bamboo Grove", location: "Arashiyama", description: "Famous bamboo forest walkway", type: "culture" },
      { time: "10:00 AM", title: "Tenryu-ji Temple", location: "Arashiyama", description: "UNESCO World Heritage Zen temple", type: "culture" },
      { time: "12:00 PM", title: "Tofu Kaiseki Lunch", location: "Arashiyama", description: "Traditional Buddhist vegetarian cuisine", type: "food" },
      { time: "2:30 PM", title: "Monkey Park Iwatayama", location: "Arashiyama", description: "Mountain park with city views", type: "culture" },
      { time: "5:00 PM", title: "Gion District Walk", location: "Gion", description: "Traditional geisha district", type: "culture" },
      { time: "7:00 PM", title: "Departure", location: "Kyoto Station", description: "Return journey to Tokyo/Osaka", type: "transport" },
    ]
  }
];

const airbnbListings: AirbnbListing[] = [
  {
    id: "1",
    title: "Traditional Machiya near Kiyomizu",
    price: 185,
    rating: 4.9,
    reviews: 127,
    type: "Entire home",
    neighborhood: "Higashiyama",
    image: "🏠",
    amenities: ["WiFi", "Kitchen", "Tatami", "Garden"]
  },
  {
    id: "2",
    title: "Modern Apt in Gion District",
    price: 145,
    rating: 4.7,
    reviews: 89,
    type: "Entire apartment",
    neighborhood: "Gion",
    image: "🏢",
    amenities: ["WiFi", "AC", "Washer", "Near Metro"]
  },
  {
    id: "3",
    title: "Cozy Room near Fushimi Inari",
    price: 85,
    rating: 4.6,
    reviews: 203,
    type: "Private room",
    neighborhood: "Fushimi",
    image: "🏡",
    amenities: ["WiFi", "Breakfast", "Shared Bath"]
  },
  {
    id: "4",
    title: "Luxury Ryokan Experience",
    price: 295,
    rating: 5.0,
    reviews: 45,
    type: "Traditional inn",
    neighborhood: "Arashiyama",
    image: "🏮",
    amenities: ["Onsen", "Kaiseki", "Tatami", "Garden"]
  },
  {
    id: "5",
    title: "Budget Hostel Dorm",
    price: 35,
    rating: 4.3,
    reviews: 156,
    type: "Shared dorm",
    neighborhood: "Kyoto Station",
    image: "🛏️",
    amenities: ["WiFi", "Lounge", "Kitchen", "Lockers"]
  },
  {
    id: "6",
    title: "Zen Temple Stay",
    price: 120,
    rating: 4.8,
    reviews: 67,
    type: "Temple lodging",
    neighborhood: "Higashiyama",
    image: "⛩️",
    amenities: ["Meditation", "Vegetarian", "Garden"]
  }
];

const redditRamenPosts: RedditRamenPost[] = [
  {
    id: "1",
    title: "Best ramen in Kyoto? Just spent 3 days eating my way through the city 🍜",
    author: "u/ramenhunter_kyoto",
    score: 847,
    comments: 123,
    content: "Ichiran Kyoto branch is touristy but consistently good. Hidden gem: Ramen Koji in Kyoto Station basement has 8 different ramen shops!",
    timestamp: "2h ago",
    location: "Kyoto Station"
  },
  {
    id: "2",
    title: "Kyoto ramen vs Tokyo ramen - what's the difference?",
    author: "u/noodlenovice",
    score: 234,
    comments: 67,
    content: "Kyoto ramen tends to be lighter, more delicate flavors. Try Kyoto-style chicken-based broth at Ganko Ramen near Nishiki Market.",
    timestamp: "5h ago",
    location: "Nishiki Market"
  },
  {
    id: "3",
    title: "PSA: Ramen Yokocho (Ramen Alley) in Kyoto Station is ramen heaven!",
    author: "u/trainstation_foodie",
    score: 567,
    comments: 89,
    content: "8 different ramen shops in one place. Tried 4 different bowls in 2 hours. Kyoto Ramen Koji is a must-visit for any ramen lover!",
    timestamp: "8h ago",
    location: "Kyoto Station"
  },
  {
    id: "4",
    title: "Found this tiny 6-seat ramen shop in Pontocho Alley...",
    author: "u/hidden_gems_kyoto",
    score: 1205,
    comments: 156,
    content: "No English menu, just point and smile. Best yuzu ramen I've ever had. Owner has been making ramen for 40+ years.",
    timestamp: "12h ago",
    location: "Pontocho Alley"
  },
  {
    id: "5",
    title: "Vegetarian ramen options in Kyoto?",
    author: "u/veggie_traveler",
    score: 89,
    comments: 34,
    content: "Ganko Ramen has amazing vegetable-based broth. Also check out the Buddhist temple restaurants - they make incredible shojin ryori.",
    timestamp: "1d ago",
    location: "Various"
  },
  {
    id: "6",
    title: "Late night ramen after exploring Gion district?",
    author: "u/night_owl_kyoto",
    score: 156,
    comments: 45,
    content: "Ramen shops stay open late! Ichiran is 24/7. For something local, try the small shop next to Yasaka Shrine - open until 2 AM.",
    timestamp: "1d ago",
    location: "Gion"
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'food': return tokens.colors.accent.warm;
    case 'culture': return tokens.colors.brand.primary;
    case 'shopping': return tokens.colors.accent.success;
    case 'transport': return tokens.colors.accent.warning;
    default: return tokens.colors.text.muted;
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
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  return (
    <VStack spacing={6} align="stretch" w="full" maxW="1400px">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize={tokens.typography.fontSize['2xl']} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
            Kyoto Weekend Plan
          </Text>
          <Text fontSize={tokens.typography.fontSize.md} color={tokens.colors.text.secondary} fontWeight={tokens.typography.fontWeight.normal}>
            Complete guide • Maps • Accommodations • Ramen insights
          </Text>
        </VStack>
        <HStack spacing={3}>
          <Badge colorScheme="purple" variant="solid" px={3} py={1}>
            2 days
          </Badge>
          <Badge colorScheme="green" variant="solid" px={3} py={1}>
            Live Data
          </Badge>
        </HStack>
      </HStack>

      {/* Main Content */}
      <Tabs variant="soft-rounded" colorScheme="purple">
        <TabList justifyContent="center" mb={6}>
          <Tab fontSize="sm" fontWeight="600">📍 Itinerary & Maps</Tab>
          <Tab fontSize="sm" fontWeight="600">🏠 Accommodations</Tab>
          <Tab fontSize="sm" fontWeight="600">🍜 Ramen Community</Tab>
        </TabList>
        
        <TabPanels>
          {/* Tab 1: Itinerary & Maps */}
          <TabPanel p={0}>
            <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={6}>
              {/* Itinerary Column */}
              <GridItem>
                <VStack spacing={4} align="stretch">
                  {kyotoItinerary.map((day, dayIndex) => (
                    <MotionCard
                      key={day.day}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: dayIndex * 0.1 }}
                      bg={tokens.glass.light.background}
                      backdropFilter={tokens.glass.light.blur}
                      borderRadius={tokens.radius['2xl']}
                      border={tokens.glass.light.border}
                    >
                      <CardBody p={tokens.space[3]}>
                        <HStack justify="space-between" mb={4}>
                          <Text fontSize={tokens.typography.fontSize.xl} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
                            {day.day}
                          </Text>
                          <Badge colorScheme="purple" variant="solid">
                            {day.activities.length} stops
                          </Badge>
                        </HStack>
                        <VStack spacing={4} align="stretch">
                          {day.activities.map((activity, actIndex) => (
                            <MotionBox
                              key={actIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: (dayIndex * 0.1) + (actIndex * 0.05) }}
                            >
                              <HStack spacing={tokens.space[2]} align="start" p={tokens.space[2]} borderRadius={tokens.radius.lg} bg={tokens.glass.light.background}>
                                <VStack spacing={1} minW="80px" align="start">
                                  <Text fontSize={tokens.typography.fontSize.sm} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.secondary}>
                                    {activity.time}
                                  </Text>
                                  <Text fontSize="lg">
                                    {getTypeIcon(activity.type)}
                                  </Text>
                                </VStack>
                                <Box flex="1">
                                  <VStack spacing={1} align="start">
                                    <Text fontSize={tokens.typography.fontSize.md} fontWeight={tokens.typography.fontWeight.semibold} color={tokens.colors.text.primary}>
                                      {activity.title}
                                    </Text>
                                    <Text fontSize={tokens.typography.fontSize.sm} color={getTypeColor(activity.type)} fontWeight={tokens.typography.fontWeight.medium}>
                                      {activity.location}
                                    </Text>
                                    <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.text.tertiary} fontWeight={tokens.typography.fontWeight.normal}>
                                      {activity.description}
                                    </Text>
                                  </VStack>
                                </Box>
                              </HStack>
                            </MotionBox>
                          ))}
                        </VStack>
                      </CardBody>
                    </MotionCard>
                  ))}
                </VStack>
              </GridItem>

              {/* Maps & Info Column */}
              <GridItem>
                <VStack spacing={6} align="stretch">
                  {/* Google Maps */}
                  <MotionCard
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    bg={tokens.glass.light.background}
                    backdropFilter={tokens.glass.light.blur}
                    borderRadius="24px"
                    border={tokens.glass.light.border}
                    overflow="hidden"
                  >
                    <CardBody p={0}>
                      <VStack spacing={0}>
                        <Box p={4} w="full">
                          <Text fontSize="lg" fontWeight="600" color={tokens.colors.text.primary} textAlign="center">
                            🗺️ Kyoto Interactive Map
                          </Text>
                          <Text fontSize="sm" color={tokens.colors.text.secondary} textAlign="center">
                            All locations marked
                          </Text>
                        </Box>
                        <AspectRatio ratio={16/12} w="full">
                          <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d52562.03179153059!2d135.7382075!3d34.9847074!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600108b16b2f6e7d%3A0x7e64ac4eb1a4cfac!2sKyoto%2C%20Japan!5e0!3m2!1sen!2sus!4v1703696400000!5m2!1sen!2sus"
                            style={{
                              border: 'none',
                              borderRadius: '0 0 24px 24px',
                              width: '100%',
                              height: '100%',
                            }}
                            title="Kyoto Google Map"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </AspectRatio>
                      </VStack>
                    </CardBody>
                  </MotionCard>

                  {/* Weather Widget */}
                  <MotionCard
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    bg={tokens.glass.light.background}
                    backdropFilter={tokens.glass.light.blur}
                    borderRadius={tokens.radius.xl}
                    border={tokens.glass.light.border}
                  >
                    <CardBody>
                      <VStack spacing={3} align="stretch">
                        <Text fontSize="lg" fontWeight="600" color={tokens.colors.text.primary} textAlign="center">
                          🌤️ Kyoto Weather
                        </Text>
                        <Box h="280px" bg={tokens.glass.light.background} borderRadius="16px" p={2}>
                          <iframe
                            src="https://embed.windy.com/embed2.html?lat=35.0116&lon=135.7681&detailLat=35.0116&detailLon=135.7681&width=650&height=450&zoom=10&level=surface&overlay=temp&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=C&radarRange=-1"
                            style={{
                              border: 'none',
                              borderRadius: '12px',
                              width: '100%',
                              height: '100%',
                              background: 'transparent',
                            }}
                            title="Kyoto Live Weather Map"
                            loading="lazy"
                          />
                        </Box>
                      </VStack>
                    </CardBody>
                  </MotionCard>

                  {/* Quick Stats */}
                  <MotionCard
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    bg={tokens.glass.light.background}
                    backdropFilter={tokens.glass.light.blur}
                    borderRadius={tokens.radius.xl}
                    border={tokens.glass.light.border}
                  >
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        <Text fontSize="lg" fontWeight="600" color={tokens.colors.text.primary}>
                          📊 Trip Stats
                        </Text>
                        <SimpleGrid columns={2} spacing={4}>
                          <Stat>
                            <StatLabel fontSize="xs" color={tokens.colors.text.tertiary}>Total Distance</StatLabel>
                            <StatNumber fontSize="lg" color={tokens.colors.text.primary}>23 km</StatNumber>
                            <StatHelpText fontSize="xs">Walking + Train</StatHelpText>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="xs" color="rgba(255, 255, 255, 0.7)">Est. Budget</StatLabel>
                            <StatNumber fontSize="lg" color={tokens.colors.text.inverse}>¥8,500</StatNumber>
                            <StatHelpText fontSize="xs">Per person</StatHelpText>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="xs" color="rgba(255, 255, 255, 0.7)">Temples</StatLabel>
                            <StatNumber fontSize="lg" color={tokens.colors.text.inverse}>4</StatNumber>
                            <StatHelpText fontSize="xs">UNESCO sites</StatHelpText>
                          </Stat>
                          <Stat>
                            <StatLabel fontSize="xs" color="rgba(255, 255, 255, 0.7)">Food Stops</StatLabel>
                            <StatNumber fontSize="lg" color={tokens.colors.text.inverse}>6</StatNumber>
                            <StatHelpText fontSize="xs">Local favorites</StatHelpText>
                          </Stat>
                        </SimpleGrid>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                </VStack>
              </GridItem>
            </Grid>
          </TabPanel>

          {/* Tab 2: Accommodations */}
          <TabPanel p={0}>
            <VStack spacing={6} align="stretch">
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg={tokens.glass.light.background}
                backdropFilter={tokens.glass.light.blur}
                borderRadius="24px"
                border={tokens.glass.light.border}
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="xl" fontWeight="600" color={tokens.colors.text.primary}>
                        🏠 Kyoto Accommodations
                      </Text>
                      <Badge colorScheme="blue" variant="solid">
                        {airbnbListings.length} options
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={tokens.colors.text.secondary}>
                      Hand-picked stays near major attractions with great reviews
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {airbnbListings.map((listing, index) => (
                  <MotionCard
                    key={listing.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    bg={tokens.glass.light.background}
                    backdropFilter={tokens.glass.light.blur}
                    borderRadius={tokens.radius.xl}
                    border={tokens.glass.light.border}
                    cursor="pointer"
                    _hover={{ transform: 'translateY(-4px)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)' }}
                    onClick={() => setSelectedListing(selectedListing === listing.id ? null : listing.id)}
                  >
                    <CardBody p={5}>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between" align="start">
                          <Text fontSize="2xl">{listing.image}</Text>
                          <VStack spacing={1} align="end">
                            <Text fontSize="lg" fontWeight="700" color={tokens.colors.text.primary}>
                              ${listing.price}
                            </Text>
                            <Text fontSize="xs" color={tokens.colors.text.tertiary}>per night</Text>
                          </VStack>
                        </HStack>
                        
                        <VStack spacing={2} align="start">
                          <Text fontSize="md" fontWeight="600" color={tokens.colors.text.primary} noOfLines={2}>
                            {listing.title}
                          </Text>
                          <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.brand.primary} fontWeight={tokens.typography.fontWeight.medium}>
                            {listing.neighborhood}
                          </Text>
                          <Badge colorScheme="gray" variant="subtle" size="sm">
                            {listing.type}
                          </Badge>
                        </VStack>

                        <HStack justify="space-between">
                          <HStack spacing={1}>
                            <Text fontSize="sm" fontWeight="600" color={tokens.colors.text.primary}>
                              ⭐ {listing.rating}
                            </Text>
                            <Text fontSize="xs" color={tokens.colors.text.tertiary}>
                              ({listing.reviews})
                            </Text>
                          </HStack>
                          <Text fontSize="xs" color={tokens.colors.text.muted}>
                            {selectedListing === listing.id ? '↑ Hide' : '↓ Details'}
                          </Text>
                        </HStack>

                        <AnimatePresence>
                          {selectedListing === listing.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              <VStack spacing={2} align="start" mt={3} pt={3} borderTop="1px solid" borderColor={tokens.colors.surface.divider}>
                                <Text fontSize="sm" fontWeight="600" color={tokens.colors.text.primary}>
                                  Amenities:
                                </Text>
                                <Flex wrap="wrap" gap={1}>
                                  {listing.amenities.map((amenity, i) => (
                                    <Badge key={i} colorScheme="blue" variant="outline" size="xs">
                                      {amenity}
                                    </Badge>
                                  ))}
                                </Flex>
                              </VStack>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </SimpleGrid>

              {/* Price Comparison Chart */}
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                bg={tokens.surface.card.background}
                backdropFilter={tokens.glass.light.blur}
                borderRadius="24px"
                border="1px solid rgba(0, 0, 0, 0.05)"
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <Text fontSize="lg" fontWeight="600" color={tokens.colors.text.primary}>
                      📊 Price Comparison by Neighborhood
                    </Text>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      <Stat>
                        <StatLabel fontSize="xs" color="rgba(255, 255, 255, 0.7)">Gion District</StatLabel>
                        <StatNumber fontSize="lg" color={tokens.colors.text.inverse}>$145</StatNumber>
                        <StatHelpText fontSize="xs">avg/night</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel fontSize="xs" color="rgba(255, 255, 255, 0.7)">Higashiyama</StatLabel>
                        <StatNumber fontSize="lg" color={tokens.colors.text.inverse}>$152</StatNumber>
                        <StatHelpText fontSize="xs">avg/night</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel fontSize="xs" color="rgba(255, 255, 255, 0.7)">Arashiyama</StatLabel>
                        <StatNumber fontSize="lg" color={tokens.colors.text.inverse}>$207</StatNumber>
                        <StatHelpText fontSize="xs">avg/night</StatHelpText>
                      </Stat>
                      <Stat>
                        <StatLabel fontSize="xs" color="rgba(255, 255, 255, 0.7)">Kyoto Station</StatLabel>
                        <StatNumber fontSize="lg" color={tokens.colors.text.inverse}>$60</StatNumber>
                        <StatHelpText fontSize="xs">avg/night</StatHelpText>
                      </Stat>
                    </SimpleGrid>
                    <Progress value={75} colorScheme="purple" size="sm" borderRadius="full" />
                    <Text fontSize="xs" color={tokens.colors.text.tertiary} textAlign="center">
                      Booking rates: 75% occupancy this weekend
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>
            </VStack>
          </TabPanel>

          {/* Tab 3: Ramen Community */}
          <TabPanel p={0}>
            <VStack spacing={6} align="stretch">
              <MotionCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                bg={tokens.glass.light.background}
                backdropFilter={tokens.glass.light.blur}
                borderRadius="24px"
                border={tokens.glass.light.border}
              >
                <CardBody p={6}>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontSize="xl" fontWeight="600" color={tokens.colors.text.primary}>
                        🍜 Reddit: r/ramen • Kyoto Thread
                      </Text>
                      <Badge colorScheme="orange" variant="solid">
                        Live Feed
                      </Badge>
                    </HStack>
                    <Text fontSize="sm" color={tokens.colors.text.secondary}>
                      Real insights from ramen enthusiasts who've explored Kyoto
                    </Text>
                  </VStack>
                </CardBody>
              </MotionCard>

              <VStack spacing={4} align="stretch">
                {redditRamenPosts.map((post, index) => (
                  <MotionCard
                    key={post.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    bg={tokens.glass.light.background}
                    backdropFilter={tokens.glass.light.blur}
                    borderRadius={tokens.radius.xl}
                    border={tokens.glass.light.border}
                  >
                    <CardBody p={5}>
                      <VStack spacing={3} align="stretch">
                        <HStack justify="space-between" align="start">
                          <VStack spacing={1} align="start" flex="1">
                            <Text fontSize="md" fontWeight="600" color={tokens.colors.text.primary} noOfLines={2}>
                              {post.title}
                            </Text>
                            <HStack spacing={3}>
                              <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.accent.warm} fontWeight={tokens.typography.fontWeight.medium}>
                                {post.author}
                              </Text>
                              <Text fontSize={tokens.typography.fontSize.sm} color={tokens.colors.brand.primary} fontWeight={tokens.typography.fontWeight.medium}>
                                📍 {post.location}
                              </Text>
                              <Text fontSize="xs" color={tokens.colors.text.muted}>
                                {post.timestamp}
                              </Text>
                            </HStack>
                          </VStack>
                          <VStack spacing={1} align="end">
                            <HStack>
                              <Text fontSize="sm" fontWeight="600" color={tokens.colors.text.secondary}>
                                ↑ {post.score}
                              </Text>
                            </HStack>
                            <Text fontSize="xs" color={tokens.colors.text.muted}>
                              💬 {post.comments}
                            </Text>
                          </VStack>
                        </HStack>
                        
                        <Text fontSize="sm" color={tokens.colors.text.secondary} bg={tokens.glass.light.background} p={3} borderRadius="12px">
                          {post.content}
                        </Text>
                        
                        <HStack justify="space-between">
                          <HStack spacing={2}>
                            <Badge colorScheme="orange" variant="outline" size="sm">
                              🍜 Ramen
                            </Badge>
                            <Badge colorScheme="purple" variant="outline" size="sm">
                              🏮 Kyoto
                            </Badge>
                          </HStack>
                          <Text fontSize="xs" color={tokens.colors.text.muted}>
                            r/ramen
                          </Text>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </MotionCard>
                ))}
              </VStack>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};