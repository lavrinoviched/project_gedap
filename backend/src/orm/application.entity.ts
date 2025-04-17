import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Application {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone?: string;

  @Column()
  email: string;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'approved' | 'rejected';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
    adminComment: string | null;
}