'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Video, Search, Clock, Play, Lock, Link } from 'lucide-react';
import YouTube from 'react-youtube';

export default function VideoaulasPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [videoaulas, setVideoaulas] = useState([]);

    const extractVideoId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const infoVideo = async (videoId) => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`);
            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const videoInfo = data.items[0];
                const duration = videoInfo.contentDetails.duration;
                const minutes = Math.floor(parseInt(duration.match(/PT(\d+)M/)?.[1] || 0));
                const seconds = parseInt(duration.match(/PT(?:\d+M)?(\d+)S/)?.[1] || 0);

                return {
                    id: videoId,
                    titulo: videoInfo.snippet.title,
                    professor: videoInfo.snippet.channelTitle,
                    duracao: `${minutes}:${seconds.toString().padStart(2, '0')}`,
                    categoria: "YouTube",
                    descricao: videoInfo.snippet.description,
                    thumbnail: videoInfo.snippet.thumbnails.high.url,
                    videoId: videoId
                };
            }
            return null;
        } catch (error) {
            print('Erro ao buscar informações do vídeo:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddVideo = async () => {
        const videoId = extractVideoId(youtubeUrl);
        if (!videoId) {
            alert('URL do YouTube inválida');
            return;
        }

        const videoInfo = await infoVideo(videoId);
        if (videoInfo) {
            setVideoaulas(prev => [...prev, videoInfo]);
            setYoutubeUrl('');
        }
    };

    const filteredVideos = videoaulas.filter(video =>
        video.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.categoria.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Videoaulas
                </h1>
                <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative w-full lg:w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Buscar videoaulas..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
                        <div className="relative w-full lg:w-96">
                            <Link className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Cole o link do YouTube aqui..."
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button
                            onClick={handleAddVideo}
                            disabled={isLoading}
                            className="w-full lg:w-auto"
                        >
                            {isLoading ? 'Carregando...' : 'Adicionar'}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 min-h-[calc(100vh-12rem)]">
                {/* Lista de videoaulas */}
                <div className="xl:col-span-1 overflow-y-auto overflow-x-hidden p-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                    <div className="space-y-4">
                        {filteredVideos.map((video) => (
                            <Card
                                key={video.id}
                                className={`cursor-pointer transition-all hover:shadow-lg ${
                                    selectedVideo?.id === video.id ? 'ring-2 ring-blue-500' : ''
                                }`}
                                onClick={() => setSelectedVideo(video)}
                            >
                                <CardHeader className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <CardTitle className="break-words text-base sm:text-sm md:text-base lg:text-lg xl:text-xl">{video.titulo}</CardTitle>
                                            <CardDescription className="mt-1 truncate">
                                                {video.professor}
                                            </CardDescription>
                                        </div>
                                        {video.bloqueado ? (
                                            <Lock className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                                        ) : (
                                            <Clock className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">
                                            {video.duracao}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                            {video.categoria}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Player de vídeo */}
                <div className="xl:col-span-2">
                    {selectedVideo ? (
                        <Card className="h-full">
                            <div className="aspect-video bg-gray-200 dark:bg-gray-800 relative">
                                {selectedVideo.videoId && (
                                    <YouTube
                                        videoId={selectedVideo.videoId}
                                        opts={opts}
                                        className="w-full h-full"
                                    />
                                )}
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl">{selectedVideo.titulo}</CardTitle>
                                <CardDescription>
                                    {selectedVideo.professor} • {selectedVideo.duracao}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {selectedVideo.descricao}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="h-full flex items-center justify-center">
                            <div className="text-center p-8">
                                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-500">
                                    Selecione uma videoaula para começar
                                </p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}