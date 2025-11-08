import {chapterVData, fileLinks} from "@/lib/data/chapters";
import ChapterTemplate from "@/components/ChapterTemplate";

export default function ChapterVPage() {
    return (
        <ChapterTemplate
            chapterId="V"
            chapterData={chapterVData}
            fileLink={fileLinks.V.Narrator}
        />
    );
}
