import { ChefHat } from 'lucide-react';


interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', onClick }) => {
  const isLarge = size === 'lg';

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group transition-transform duration-200 active:scale-95`}
    >
      {/* Icon Badge */}
      <div
        className={`relative flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-orange-500/20 border-2 border-amber-400/60 transition-transform group-hover:scale-105 ${
          isLarge ? 'w-12 h-12' : 'w-10 h-10'
        }`}
      >
        <ChefHat className={`text-white ${isLarge ? 'w-6 h-6' : 'w-5 h-5'} drop-shadow-sm`} />
        {/* Subtle decorative sparkle */}
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-300 rounded-full animate-ping opacity-75" />
      </div>

      {/* Brand Text */}
      <div className="flex flex-col text-left">
        <div className="flex items-center">
          <span className={`font-extrabold tracking-tight text-white ${isLarge ? 'text-2xl' : 'text-xl'}`}>
            Tasty<span className="text-amber-500">BItes</span>
          </span>
        </div>
      </div>
    </div>
  );
};
