import { JustifyContentEnum, TextAlignEnum } from '../../enum';
import {
  JustifyContentType,
  TextAlignType,
} from '../../interfaces/scss/scss.interface';

export const JUSTIFY_CONTENT_ALIGN_OBJECT: Record<
  JustifyContentType,
  JustifyContentEnum
> = {
  Start: JustifyContentEnum.Start,
  Center: JustifyContentEnum.Center,
  End: JustifyContentEnum.End,
  Around: JustifyContentEnum.Around,
  Between: JustifyContentEnum.Between,
  Evenly: JustifyContentEnum.Evenly,
};

export const TEXT_ALIGN_OBJECT: Record<TextAlignType, TextAlignEnum> = {
  Start: TextAlignEnum.Start,
  Center: TextAlignEnum.Center,
  End: TextAlignEnum.End,
};
