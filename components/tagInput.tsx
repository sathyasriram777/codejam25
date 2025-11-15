'use client';

import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';


const DEFAULT_GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy', 'Adventure', 'Animation'];

interface TagInputProps {
    tags?: string[];
    onTagsChange?: (tags: string[]) => void;
}

export function TagInput({ tags = [], onTagsChange }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleGenreClick = (genre: string) => {
        if (!tags.includes(genre) && onTagsChange) {
            onTagsChange([...tags, genre]);
        }
    };

    const handleAddTag = (tag: string) => {
        if (tag.trim() && !tags.includes(tag.trim()) && onTagsChange) {
            onTagsChange([...tags, tag.trim()]);
            setInput('');
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-wrap gap-2">
                {DEFAULT_GENRES.map((genre) => {
                    const isSelected = tags.includes(genre);
                    return (
                        <Button
                            key={genre}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleGenreClick(genre)}
                            disabled={isSelected}
                        >
                            {genre}
                        </Button>
                    );
                })}
            </div>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && input.trim()) {
                        handleAddTag(input.trim());
                    }
                }}
                placeholder="Add custom genre..."
            />
        </div>
    );
}