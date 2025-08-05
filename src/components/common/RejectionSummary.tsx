import { cn } from '@/utils/cn';
import FeedbackCard from './FeedbackCard';
import { RejectionSummaryProps } from '../types/common-components.types';

const RejectionSummary = (props: RejectionSummaryProps) => {
  const { className, rejectionComments } = props;

  return (
    <div className={cn('w-full flex flex-col flex-start justify-start gap-5', className)}>
      {rejectionComments.map((item) => (
        <FeedbackCard id={item.id} document={item.document} comment={item.comment} date={item.date} />
      ))}
    </div>
  );
};

export default RejectionSummary;
