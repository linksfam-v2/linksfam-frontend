import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';

const NotEligible = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4! py-8! sm:py-12! bg-gray-50!">
      <div className="w-full max-w-md mx-auto!">
        <div className="bg-white! rounded-xl! shadow-xl! p-6! sm:p-8!">
          {/* Icon */}
          <div className="flex items-center justify-center mb-8!">
            <div className="p-4! rounded-full! bg-red-50!">
              <svg
                className="h-12! w-12! text-red-500!"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl! font-bold! text-gray-900! text-center! mb-6!">
            Not Eligible Yet
          </h2>

          {/* Requirements */}
          <div className="text-center! mb-8!">
            <p className="text-gray-600! text-lg! mb-6!">
              To be eligible, you need to have either:
            </p>
            <div className="space-y-4! max-w-sm! mx-auto!">
              <div className="flex items-center justify-center p-4! rounded-lg! bg-gray-50! border! border-gray-100!">
                <svg
                  className="h-6! w-6! text-red-500! mr-3!"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700! font-medium!">
                  YouTube channel with 500+ subscribers & 1 video uploaded in the last 30 days.
                </span>
              </div>
              <div className="flex items-center justify-center p-4! rounded-lg! bg-gray-50! border! border-gray-100!">
                <svg
                  className="h-6! w-6! text-red-500! mr-3!"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-700! font-medium!">
                  Instagram account with 2,000+ followers
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8!">
            <Button
              title="Connect Your Social Accounts"
              onClick={() => navigate('/creator/social')}
              className="w-full! bg-blue-600! text-white! text-lg! font-semibold! rounded-lg! py-4! px-6! hover:bg-blue-700! focus:ring-4! focus:ring-blue-500/50! transition-colors! duration-200!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotEligible;