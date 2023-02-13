import { Injectable, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Event,
  EventSchema,
} from 'src/events/entities/event.entity/event.entity';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';

// class MockCoffeeService {}
class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}
@Injectable()
export class CoffeeBrandsFactory {
  create() {
    return ['buudy brew', 'nescafe'];
  }
}

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coffee.name, schema: CoffeeSchema },
      {
        name: Event.name,
        schema: EventSchema,
      },
    ]),
  ],
  controllers: [CoffeesController],
  // providers: [CoffeesService],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    {
      provide: COFFEE_BRANDS,
      useFactory: (brandsFactory: CoffeeBrandsFactory) =>
        brandsFactory.create(),
      inject: [CoffeeBrandsFactory],
    },
  ],
  // providers: [{ provide: CoffeesService, useValue: new MockCoffeeService() }],
  exports: [CoffeesService],
})
export class CoffeesModule {}
