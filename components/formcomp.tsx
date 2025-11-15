"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { X } from "lucide-react"
import { TagInput } from "./tagInput"

const formSchema = z.object({
    genres: z.array(z.string()).optional(),
    songs: z.string().optional(),
    ageRating: z.string().optional(),
    language: z.array(z.string()).optional(),
    era: z.string().optional(),
})

const LANGUAGES = ['English', 'German', 'French', 'Spanish', 'Bengali', 'Hindi', 'Korean', 'Japanese', 'Chinese', 'Arabic', 'Russian', 'Portuguese', 'Italian'];


export function FormComp() {
    const [allInputs, setAllInputs] = useState<string[]>([]);
    const [genreTags, setGenreTags] = useState<string[]>([]);
    const [languageTags, setLanguageTags] = useState<string[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),

    })

    function onSubmit() {
        // Return the data in the schema structure
        // ✅ This matches the formSchema format
        const formData: z.infer<typeof formSchema> = {
            genres: genreTags.length > 0 ? genreTags : undefined,
            songs: form.getValues("songs") || undefined,
            ageRating: form.getValues("ageRating") || undefined,
            language: languageTags.length > 0 ? languageTags : undefined,
            era: form.getValues("era") || undefined,
        };
        
        console.log("Form submission data (schema format):", formData);
        return formData;
    }

    const addToAllInputs = (value: string) => {
        if (value && !allInputs.includes(value)) {
            setAllInputs([...allInputs, value]);
        }
    };

    const removeFromAllInputs = (value: string) => {
        setAllInputs(allInputs.filter((input) => input !== value));
    };

    const handleGenreTagsChange = (tags: string[]) => {
        // Remove old genre tags that are no longer in the list
        const removedTags = genreTags.filter(tag => !tags.includes(tag));
        removedTags.forEach(tag => removeFromAllInputs(tag));
        
        // Add new genre tags
        const newTags = tags.filter(tag => !genreTags.includes(tag));
        newTags.forEach(tag => addToAllInputs(tag));
        
        setGenreTags(tags);
    };

    const handleSongBlur = (value: string) => {
        // Remove old song value if it exists in allInputs
        const oldValue = form.getValues("songs");
        if (oldValue && allInputs.includes(oldValue)) {
            removeFromAllInputs(oldValue);
        }
        // Add new song value if not empty
        if (value && value.trim() && !allInputs.includes(value.trim())) {
            addToAllInputs(value.trim());
        }
    };

    const handleLanguageTagsChange = (tags: string[]) => {
        // Remove old language tags that are no longer in the list
        const removedTags = languageTags.filter(tag => !tags.includes(tag));
        removedTags.forEach(tag => removeFromAllInputs(tag));
        
        // Add new language tags
        const newTags = tags.filter(tag => !languageTags.includes(tag));
        newTags.forEach(tag => addToAllInputs(tag));
        
        setLanguageTags(tags);
    };

    const handleSelectChange = (value: string, fieldName: "ageRating" | "era") => {
        // Remove old value if it exists in allInputs
        const oldValue = form.getValues(fieldName);
        if (oldValue && allInputs.includes(oldValue)) {
            removeFromAllInputs(oldValue);
        }
        // Add new value
        if (value && !allInputs.includes(value)) {
            addToAllInputs(value);
        }
    };

    return (
        <div className="space-y-6">
            {/* Box containing all user inputs */}
            <Card>
                <CardHeader>
                    <CardTitle>Your Selections</CardTitle>
                </CardHeader>
                <CardContent>
                    {allInputs.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {allInputs.map((input) => (
                                <div key={input} className="flex items-center gap-2 px-3 py-1 bg-primary text-primary-foreground rounded-md">
                                    {input}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 hover:bg-primary-foreground/20"
                                        onClick={() => removeFromAllInputs(input)}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">No selections yet. Start filling out the form below!</p>
                    )}
                </CardContent>
            </Card>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="genres"
                        render={() => (
                            <FormItem>
                                <FormLabel>Sooo... what are we feeling tonight, moviewise?</FormLabel>
                                <FormControl>
                                    <TagInput tags={genreTags} onTagsChange={handleGenreTagsChange} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="songs"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What songs fit the vibe tonight?</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field} 
                                        onBlur={(e) => {
                                            field.onBlur();
                                            handleSongBlur(e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && field.value && field.value.trim()) {
                                                e.preventDefault();
                                                handleSongBlur(field.value);
                                            }
                                        }}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="ageRating"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Choose your preferred age rating</FormLabel>
                                <Select 
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        handleSelectChange(value, "ageRating");
                                    }} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Choose your preferred age rating" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Age Ratings</SelectLabel>
                                            <SelectItem value="G">G</SelectItem>
                                            <SelectItem value="PG">PG</SelectItem>
                                            <SelectItem value="PG-13">PG-13</SelectItem>
                                            <SelectItem value="R">R</SelectItem>
                                            <SelectItem value="NC-17">NC-17</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="language"
                        render={() => (
                            <FormItem>
                                <FormLabel>Preferred languages</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="flex flex-wrap gap-2">
                                            {LANGUAGES.map((language) => {
                                                const isSelected = languageTags.includes(language);
                                                return (
                                                    <Button
                                                        key={language}
                                                        type="button"
                                                        variant={isSelected ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            if (!isSelected) {
                                                                handleLanguageTagsChange([...languageTags, language]);
                                                            } else {
                                                                handleLanguageTagsChange(languageTags.filter(t => t !== language));
                                                            }
                                                        }}
                                                    >
                                                        {language}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="era"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>What era are you in the mood for?</FormLabel>
                                <Select 
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        handleSelectChange(value, "era");
                                    }} 
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Choose an era" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Era</SelectLabel>
                                            <SelectItem value="1920s">1920s</SelectItem>
                                            <SelectItem value="1930s">1930s</SelectItem>
                                            <SelectItem value="1940s">1940s</SelectItem>
                                            <SelectItem value="1950s">1950s</SelectItem>
                                            <SelectItem value="1960s">1960s</SelectItem>
                                            <SelectItem value="1970s">1970s</SelectItem>
                                            <SelectItem value="1980s">1980s</SelectItem>
                                            <SelectItem value="1990s">1990s</SelectItem>
                                            <SelectItem value="2000s">2000s</SelectItem>
                                            <SelectItem value="2010s">2010s</SelectItem>
                                            <SelectItem value="2020s">2020s</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />

                    <Button type="submit"> Submit</Button>
                </form>
            </Form>
        </div>
    );
}