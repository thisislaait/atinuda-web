import { Download, Save, Share2, X } from 'lucide-react';

    type GalleryImage = {
    id: number;
    src: string;
    caption: string;
    };

    type GalleryModalProps = {
    image: GalleryImage;
    onClose: () => void;
    };

    const GalleryModal = ({ image, onClose }: GalleryModalProps) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `image-${image.id}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        if (navigator.share) {
        await navigator.share({
            title: image.caption,
            url: image.src,
        });
        } else {
        alert("Your browser doesn't support Web Share API");
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full overflow-hidden">
            <div className="relative">
            <button
                onClick={onClose}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
            >
                <X className="h-5 w-5" />
            </button>
            <img src={image.src} alt={image.caption} className="w-full max-h-[60vh] object-cover" />
            </div>
            <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">{image.caption}</h2>
            <div className="flex space-x-4">
                <button onClick={handleShare} className="flex items-center gap-1 text-blue-600 hover:underline">
                <Share2 size={16} /> Share
                </button>
                <button onClick={handleDownload} className="flex items-center gap-1 text-green-600 hover:underline">
                <Download size={16} /> Download
                </button>
                <button className="flex items-center gap-1 text-purple-600 hover:underline">
                <Save size={16} /> Save
                </button>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default GalleryModal;
