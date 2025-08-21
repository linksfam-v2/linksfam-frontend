import React from 'react';

interface AvatarProps {
    name: string;
    size?: number; // size in rem
    backgroundColor?: string;
    textColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
    name,
    size = 2.5, // 40px ≈ 2.5rem
    backgroundColor = '#1e40af',
    textColor = '#ffffff'
}) => {


    const dynamicStyles = {
        width: `${size}rem`,
        height: `${size}rem`,
        backgroundColor,
        color: textColor,
        fontSize: `${size * 0.5}rem`
    };

    return (

        <div className="" style={dynamicStyles}>
            {name && name.charAt(0).toUpperCase()}
        </div>
    );
};

export default Avatar;