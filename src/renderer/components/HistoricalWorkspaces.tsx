import React, { useState, useEffect } from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Grid,
  GridItem,
  Tooltip,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon, TimeIcon } from '@chakra-ui/icons';
import { tokens } from '../design-tokens';
import { workspaceCache, CachedWorkspace } from '../services/WorkspaceCache';

const MotionBox = motion(Box);
const MotionGrid = motion(Grid);

interface HistoricalWorkspacesProps {
  onWorkspaceSelect: (workspace: CachedWorkspace) => void;
  maxDisplay?: number;
}

export const HistoricalWorkspaces: React.FC<HistoricalWorkspacesProps> = ({
  onWorkspaceSelect,
  maxDisplay = 6,
}) => {
  const [recentWorkspaces, setRecentWorkspaces] = useState<CachedWorkspace[]>([]);
  const [hoveredWorkspace, setHoveredWorkspace] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadRecentWorkspaces();
  }, []);

  const loadRecentWorkspaces = async () => {
    await workspaceCache.loadCache();
    const recent = workspaceCache.getRecentWorkspaces(maxDisplay);
    setRecentWorkspaces(recent);
  };

  const handleWorkspaceClick = (workspace: CachedWorkspace) => {
    onWorkspaceSelect(workspace);
  };

  const handleDeleteWorkspace = async (e: React.MouseEvent, workspaceId: string) => {
    e.stopPropagation();
    await workspaceCache.deleteWorkspace(workspaceId);
    loadRecentWorkspaces(); // Refresh the list
  };

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const getWorkspaceTypeColor = (type: 'static' | 'dynamic'): string => {
    return type === 'static' ? 'blue' : 'purple';
  };

  if (recentWorkspaces.length === 0) {
    return null; // Don't show anything if no cached workspaces
  }

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      w="full"
      maxW="900px"
      mt={8}
    >
      {/* Header */}
      <HStack justify="space-between" align="center" mb={4}>
        <HStack spacing={2} align="center">
          <TimeIcon color={tokens.colors.text.tertiary} boxSize={4} />
          <Text 
            fontSize="sm" 
            fontWeight="500" 
            color={tokens.colors.text.secondary}
            letterSpacing="0.02em"
          >
            Recent Workspaces
          </Text>
        </HStack>
        
        <Button
          variant="ghost"
          size="xs"
          color={tokens.colors.text.muted}
          fontSize="xs"
          fontWeight="400"
          onClick={onOpen}
          _hover={{
            color: tokens.colors.brand.primary,
            bg: tokens.colors.brand.primarySubtle,
          }}
        >
          View All
        </Button>
      </HStack>

      {/* Workspace Grid */}
      <MotionGrid
        templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }}
        gap={3}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        {recentWorkspaces.map((workspace, index) => (
          <GridItem key={workspace.id}>
            <MotionBox
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Box
                p={3}
                bg={tokens.glass.light.background}
                backdropFilter={tokens.glass.light.blur}
                border={tokens.glass.light.border}
                borderRadius={tokens.radius.lg}
                cursor="pointer"
                position="relative"
                onClick={() => handleWorkspaceClick(workspace)}
                onMouseEnter={() => setHoveredWorkspace(workspace.id)}
                onMouseLeave={() => setHoveredWorkspace(null)}
                _hover={{
                  bg: tokens.glass.medium.background,
                  borderColor: tokens.colors.brand.primaryFocus,
                }}
                transition={`all ${tokens.transition.duration.fast}`}
                minH="100px"
              >
                {/* Delete Button */}
                <AnimatePresence>
                  {hoveredWorkspace === workspace.id && (
                    <MotionBox
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      position="absolute"
                      top={2}
                      right={2}
                      zIndex={2}
                    >
                      <IconButton
                        aria-label="Delete workspace"
                        icon={<CloseIcon />}
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        borderRadius="full"
                        onClick={(e) => handleDeleteWorkspace(e, workspace.id)}
                        _hover={{ bg: 'red.100' }}
                      />
                    </MotionBox>
                  )}
                </AnimatePresence>

                <VStack align="start" spacing={2} h="full">
                  {/* Icon and Type Badge */}
                  <HStack justify="space-between" w="full">
                    <Text fontSize="lg" mb={0}>
                      {workspace.preview.icon}
                    </Text>
                    <Badge 
                      size="sm" 
                      colorScheme={getWorkspaceTypeColor(workspace.metadata.workspaceType)}
                      fontSize="10px"
                      px={2}
                      py={0.5}
                      borderRadius={tokens.radius.sm}
                    >
                      {workspace.metadata.workspaceType}
                    </Badge>
                  </HStack>

                  {/* Title */}
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color={tokens.colors.text.primary}
                    lineHeight="1.3"
                    noOfLines={1}
                    w="full"
                  >
                    {workspace.preview.title}
                  </Text>

                  {/* Description */}
                  <Text
                    fontSize="xs"
                    color={tokens.colors.text.tertiary}
                    lineHeight="1.3"
                    noOfLines={2}
                    flex={1}
                  >
                    {workspace.preview.description}
                  </Text>

                  {/* Footer Info */}
                  <HStack justify="space-between" w="full" pt={1}>
                    <Text fontSize="xs" color={tokens.colors.text.muted}>
                      {formatTimeAgo(workspace.metadata.lastAccessedAt)}
                    </Text>
                    {workspace.metadata.accessCount > 1 && (
                      <Text fontSize="xs" color={tokens.colors.text.muted}>
                        {workspace.metadata.accessCount} uses
                      </Text>
                    )}
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>
          </GridItem>
        ))}
      </MotionGrid>

      {/* View All Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={tokens.colors.canvas.raised} borderRadius={tokens.radius.xl}>
          <ModalHeader color={tokens.colors.text.primary}>
            All Workspaces ({recentWorkspaces.length})
          </ModalHeader>
          <ModalCloseButton color={tokens.colors.text.secondary} />
          <ModalBody pb={6}>
            <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={3}>
              {workspaceCache.getRecentWorkspaces(50).map((workspace) => (
                <Box
                  key={workspace.id}
                  p={3}
                  bg={tokens.glass.light.background}
                  borderRadius={tokens.radius.md}
                  cursor="pointer"
                  onClick={() => {
                    handleWorkspaceClick(workspace);
                    onClose();
                  }}
                  _hover={{ bg: tokens.glass.medium.background }}
                  transition={`all ${tokens.transition.duration.fast}`}
                >
                  <HStack spacing={3}>
                    <Text fontSize="lg">{workspace.preview.icon}</Text>
                    <VStack align="start" spacing={1} flex={1}>
                      <Text fontSize="sm" fontWeight="600" color={tokens.colors.text.primary} noOfLines={1}>
                        {workspace.preview.title}
                      </Text>
                      <Text fontSize="xs" color={tokens.colors.text.tertiary} noOfLines={1}>
                        {formatTimeAgo(workspace.metadata.lastAccessedAt)}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};