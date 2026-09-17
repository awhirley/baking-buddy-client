import { StarIcon, ThumbsUp, WavesHorizontal, EyeIcon, ArrowBigUp, Sword, type LucideIcon } from 'lucide-react';
import type { BakeRating } from './BakeTypes';
import type { ReactElement } from 'react';
import type { IconElementProps } from '#components/SharedComponents/ui/rating';

export const RATING_FIELDS: { key: keyof Omit<BakeRating, "createdAt">; label: string; icon: ReactElement<IconElementProps>; iconType: LucideIcon }[] = [
  { key: "overall", label: "Overall", icon: <StarIcon />, iconType: StarIcon },
  { key: "taste", label: "Taste", icon: <ThumbsUp />, iconType: ThumbsUp },
  { key: "texture", label: "Texture", icon: <WavesHorizontal />, iconType: WavesHorizontal },
  { key: "appearance", label: "Appearance", icon: <EyeIcon />, iconType: EyeIcon },
  { key: "riseStructure", label: "Rise / Structure", icon: <ArrowBigUp />, iconType: ArrowBigUp },
  { key: "difficulty", label: "Difficulty", icon: <Sword />, iconType: Sword },
];