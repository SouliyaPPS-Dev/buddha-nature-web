import { localStorageData } from '@/services/cache';
import { useEffect, useState } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';

const FavoriteButton = ({ currentItem }: { currentItem: any }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // Check if the current item is in the favorites list
  useEffect(() => {
    if (!currentItem || !currentItem.ID) {
      // If the current item is invalid, reset favorite state
      setIsFavorite(false);
      return;
    }

    const favorites = JSON.parse(localStorageData.getFavorite() || '[]');
    const isItemFavorite = favorites.some(
      (item: any) => item.ID === currentItem.ID
    );

    setIsFavorite(isItemFavorite); // Update state
  }, [currentItem]);

  // Toggle favorite status for the current item
  const toggleFavorite = () => {
    if (!currentItem || !currentItem.ID) {
      console.error('Invalid item: Cannot toggle favorite');
      return;
    }

    let favorites = JSON.parse(localStorageData.getFavorite() || '[]');

    if (isFavorite) {
      // If the item is already a favorite, remove it
      favorites = favorites.filter((item: any) => item.ID !== currentItem.ID);
    } else {
      // Otherwise, add it to the favorites
      favorites.push(currentItem);
    }

    // Update the favorites in localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setIsFavorite(!isFavorite); // Update the component's state
  };

  return (
    <button
      onClick={toggleFavorite}
      style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #5E412D, #8B5E3C)',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseOver={(e) =>
        Object.assign(e.currentTarget.style, {
          transform: 'scale(1.1)',
          boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
        })
      }
      onMouseOut={(e) =>
        Object.assign(e.currentTarget.style, {
          transform: 'scale(1)',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        })
      }
    >
      {/* Display the correct favorite icon */}
      {isFavorite ? (
        <MdFavorite size={25} color='pink' />
      ) : (
        <MdFavoriteBorder size={25} />
      )}
    </button>
  );
};

export default FavoriteButton;
