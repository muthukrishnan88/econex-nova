import { getAIProvider } from "./aiProvider.js";
import { ImageValidator } from "../image/imageValidator.js";

export class ImageVerifier {
    static async verify(file) {
        ImageValidator.validate(file);

        const aiProvider = getAIProvider();

        const result = await aiProvider.verifyImageAuthenticity(
            file.buffer,
            file.mimetype
        );

        return {
            success: true,
            ...result
        };
    }
}
