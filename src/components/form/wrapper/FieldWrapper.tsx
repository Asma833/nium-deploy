import { cn } from '@/utils/cn';
import '@/components/form/styles/form-layout.css';
import { FieldWrapperPropsType } from '@/components/types/common-components.types';
import '../styles/form-layout.css';

const FieldWrapper = ({ id, children, className = '', flexdirection, error, ...props }: FieldWrapperPropsType) => {
  return (
    <div id={id} {...props} className={cn('fieldWrapper', className)}>
      <div className="w-full flex flex-col">
        {props.label && <span className={cn('fieldWrapper-label text-sm mb-2', props.labelClass)}>{props.label}</span>}
        <div
          className={cn(
            'flex',
            flexdirection ? 'md:flex-' + flexdirection : 'md:flex-col',
            props.childrenClass,
            'flex-col'
          )}
        >
          {children}
        </div>
        {error && <span className="text-sm text-[hsl(var(--destructive))] mt-1">{error}</span>}
      </div>
    </div>
  );
};

export default FieldWrapper;
