import { GoogleGenAI, Type } from "@google/genai";
import { getCourseInfo } from "~/server/config/functions/getCourse";
import { performance } from "perf_hooks";

const ai = new GoogleGenAI({});

export default defineEventHandler(async (event) => {
  try {
    const courses = ["CMSC250", "MATH240", "CMSC216"];
    let coursesJSON = [];

    for (let course of courses) {
      let courseJSON = await getCourseInfo(`${course}`);
      let result = courseJSON[0]; 
      result = {
        id: result.id,
        sections: result.sections.filter(
          (section: any) => section.open > 0
        ),
      };


      coursesJSON.push(result);
    }

    console.log(coursesJSON);
    console.log("Generating a schedule!");

    const start = performance.now();
    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are given a list of real university course sections in the JSON array below.
      
      Your task:
      1. Pick **exactly one section from each course**.
      2. Make sure that **none of the selected sections have overlapping times**.
      3. Only select from the provided JSON. Do NOT invent, assume, or modify any values. Do not create new sections or instructors.
      4. Only include the selected sections in the final JSON response — nothing else.
      
      Return ONLY the selected sections as a JSON array, using the exact format shown in the input.
      
      Here is the data (JSON):
      ${JSON.stringify(coursesJSON)}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: {
                type: Type.STRING,
              },
              instructors: {
                type: Type.ARRAY,
                items: {
                  type: Type.STRING,
                },
              },
              open: {
                type: Type.NUMBER, // Or Type.INTEGER if you prefer
              },
              total: {
                type: Type.NUMBER, // Or Type.INTEGER
              },
              days_info: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    days: {
                      type: Type.STRING,
                    },
                    start_time: {
                      type: Type.STRING,
                    },
                    end_time: {
                      type: Type.STRING,
                    },
                    building: {
                      type: Type.STRING,
                    },
                    room: {
                      type: Type.STRING,
                    },
                    message: {
                      type: Type.STRING,
                    },
                    class_type: {
                      type: Type.STRING,
                    },
                  },
                },
              },
            },
            propertyOrdering: [
              "id",
              "instructors",
              "open",
              "total",
              "days_info",
            ],
          },
        },
      },
    });
    const end = performance.now();
    console.log(`⏱️ Gemini API call took ${(end - start).toFixed(2)} ms`);

    console.log(response.text);

    return JSON.parse(response.text);
  } catch (e) {
    return { message: "Failed to retrieve page." };
  }
});
