import { useState, useEffect } from 'react';
import { Sheet } from 'react-modal-sheet';
import {
  OpenGraphData,
  fetchOpenGraphData,
} from '../../services/util/opengraph';


interface ProductSheetProps {
  open: boolean;
  onClose: () => void;
  productUrls: string[];
}

const ProductSheet: React.FC<ProductSheetProps> = ({
  open,
  onClose,
  productUrls,
}) => {
  const [productData, setProductData] = useState<OpenGraphData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (open && productUrls.length > 0) {
        setLoading(true);
        try {
          const productDataPromises = productUrls.map((url) =>
            fetchOpenGraphData(url)
          );
          const results = await Promise.all(productDataPromises);
          setProductData(results);
        } catch (error) {
          console.error('Error fetching product data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [open, productUrls]);

  console.log(productData);

  const openProductLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Sheet isOpen={open} onClose={onClose} snapPoints={[0.7, 1]}>
      <Sheet.Container
        style={{
          width: '100%',
          maxWidth: '480px',
          textAlign: 'center',
          left: '50%',
          borderRadius: '0px',
          position: 'fixed',
        }}
        className=""
      >
        <Sheet.Header className="flex! items-center! justify-between! p-4! border-b! border-gray-200!">
          <h3 className="text-lg! font-semibold!">
            {productUrls.length > 1 ? 'Products' : 'Product'}
          </h3>
          <button
            onClick={onClose}
            className="p-1! rounded-full! hover:bg-gray-100!"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </Sheet.Header>

        <Sheet.Content className="p-4! overflow-auto!">
          {loading ? (
            <div className="flex! justify-center! items-center! h-40!">
              <div className="animate-spin! rounded-full! h-12! w-12! border-t-2! border-b-2! border-orange-500!"></div>
            </div>
          ) : (
            <div className="grid! grid-cols-1! gap-4! sm:grid-cols-2!">
              {productData.map((product, index) => (
                <div
                  key={index}
                  className="bg-white! rounded-lg! shadow-sm! overflow-hidden! border! border-gray-200! flex! flex-col!"
                >
                  <div className="relative! pb-[50%]! bg-gray-100!">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.title || 'Product image'}
                        className="absolute! inset-0! w-full! h-full! object-cover!"
                      />
                    ) : (
                      <div className="absolute! inset-0! flex! justify-center! items-center! bg-gray-100!">
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect width="24" height="24" fill="white" />
                          <path
                            d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C18.5304 20 19.0391 19.7893 19.4142 19.4142C19.7893 19.0391 20 18.5304 20 18V6C20 5.46957 19.7893 4.96086 19.4142 4.58579C19.0391 4.21071 18.5304 4 18 4H6C5.46957 4 4.96086 4.21071 4.58579 4.58579C4.21071 4.96086 4 5.46957 4 6V18C4 18.5304 4.21071 19.0391 4.58579 19.4142C4.96086 19.7893 5.46957 20 6 20Z"
                            stroke="#9CA3AF"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-3! flex-1! flex! flex-col!">
                    <div className="flex! justify-between! items-start! mb-2!">
                      <h4 className="text-base! font-medium! line-clamp-1! text-left! flex-1!">
                        {product.title || 'Product Title'}
                      </h4>

                      {product.price && (
                        <div className="text-base! font-bold! text-orange-500! ml-2! whitespace-nowrap!">
                          {product.currency} {product.price}
                        </div>
                      )}
                    </div>

                    <div className="flex! justify-end! items-center! mt-auto!">
                      <button
                        onClick={() => openProductLink(product.url)}
                        className="bg-orange-500! text-white! py-1! px-3! rounded! text-sm! hover:bg-orange-600! transition-colors! w-full!"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop onTap={onClose} />
    </Sheet>
  );
};

export default ProductSheet;
