import { StarIcon, ThumbsUp, WavesHorizontal, EyeIcon, ArrowBigUp, Sword, type LucideIcon } from 'lucide-react';
import type { BakeRating } from './BakeTypes';

export const RATING_FIELDS: { key: keyof Omit<BakeRating, "createdAt">; label: string; icon: LucideIcon }[] = [
  { key: "overall", label: "Overall", icon: StarIcon },
  { key: "taste", label: "Taste", icon: ThumbsUp },
  { key: "texture", label: "Texture", icon: WavesHorizontal },
  { key: "appearance", label: "Appearance", icon: EyeIcon },
  { key: "riseStructure", label: "Rise / Structure", icon: ArrowBigUp },
  { key: "difficulty", label: "Difficulty", icon: Sword },
];