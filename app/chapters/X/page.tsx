import {chapterXData, fileLinks} from "@/lib/data/chapters";
import ChapterTemplate from "@/components/ChapterTemplate";

export default function ChapterXPage() {
    return (
        <ChapterTemplate
            chapterId="X"
            chapterData={chapterXData}
            fileLink={fileLinks.X.Narrator}
        />
    );
}
