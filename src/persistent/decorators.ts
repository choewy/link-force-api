import { SetMetadata } from '@nestjs/common';

import { MetadataKey } from './enums';

export const SetOptionalRequestUserID = () => SetMetadata(MetadataKey.SetOptionalRequestUserID, true);
