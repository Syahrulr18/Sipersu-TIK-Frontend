/**
 * Skeleton loading placeholder.
 * 
 * @param {'text'|'circle'|'rect'|'card'} variant
 * @param {string} width
 * @param {string} height
 * @param {number} count
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}) => {
  const variants = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
    card: 'h-32 rounded-xl',
  };

  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, i) => (
        <div
          key={i}
          className={`bg-gray-200 animate-pulse ${variants[variant]} ${className}`}
          style={{
            width: width || (variant === 'circle' ? '40px' : '100%'),
            height: height || (variant === 'circle' ? '40px' : undefined),
          }}
        />
      ))}
    </>
  );
};

export default Skeleton;
