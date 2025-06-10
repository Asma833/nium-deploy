import { rejectionComment } from '../types/common-components.types';

const FeedbackCard = (props: rejectionComment) => {
  const { id, document, comment, date } = props;

  return (
    <div className="w-full flex flex-col">
      <p className="text-primary">{id}</p>
      <div className="text-sm space-y-1">
        <p className="">
          <span>Document:</span> <span>{document}</span>
        </p>
        <p>
          <span>Comment:</span> <span>{comment}</span>
        </p>
        <p className="text-[12px] text-gray-500">{date}</p>
      </div>
    </div>
  );
};

export default FeedbackCard;
