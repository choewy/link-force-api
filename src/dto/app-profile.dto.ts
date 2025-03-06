import { ApiProperty } from '@nestjs/swagger';

import { NodeEnv } from 'src/config/classes/node-env';

export class AppProfileDTO {
  @ApiProperty({ type: String, description: '앱 이름' })
  name: string;

  @ApiProperty({ type: String, description: '앱 버전' })
  version: string;

  @ApiProperty({ type: String, description: '앱 환경' })
  env: string;

  constructor(name: string, version: string, nodeEnv: NodeEnv) {
    this.name = name;
    this.version = version;
    this.env = nodeEnv.getValue();
  }
}
