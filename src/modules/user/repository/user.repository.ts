import { DataSource, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { FilterDto } from '../dto/filter.dto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  async getUser(filter: FilterDto) {
    const queryBuilder = this.createQueryBuilder('user');
    queryBuilder.where('user.name != :name', { name: 'superadmin' });

    filter.search &&
      queryBuilder.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: filter.search },
      );

    const entities = await queryBuilder.getMany();
    const itemCount = await queryBuilder.getCount();

    const meta = {
      page: filter?.page || 0,
      offset: filter?.take || 0,
      itemCount: itemCount || 0,
      pageCount: Math.ceil(itemCount / filter?.take)
        ? Math.ceil(itemCount / filter?.take)
        : 0,
    };

    return { entities, meta };
  }
}
