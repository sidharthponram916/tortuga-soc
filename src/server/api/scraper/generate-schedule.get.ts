import { GoogleGenAI, Type } from "@google/genai";
import { getCourseInfo } from "~/server/config/functions/getCourse";

const ai = new GoogleGenAI({});

export default defineEventHandler(async (event) => {
  try {
    const courses = ["CMSC250", "MATH240", "CMSC216", "FIRE120", "ENGL101"];
    let coursesJSON = [];

    for (let course of courses) {
      let courseJSON = await getCourseInfo(`${course}`);
      coursesJSON.push(courseJSON[0]);
    }

    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are given a list of real university course sections in the JSON array below.

      Each section has the following properties:
      - id: the section ID
      - instructors: list of instructor names
      - open: number of open seats
      - total: total seats
      - days_info: an array of scheduled meeting times with start_time, end_time, and days
      
      Your task:
      1. Pick **exactly one section from each course**.
      2. Make sure that **none of the selected sections have overlapping times**.
      3. Only select from the provided JSON. Do NOT invent, assume, or modify any values. Do not create new sections or instructors.
      4. Only include the selected sections in the final JSON response — nothing else.
      
      Return ONLY the selected sections as a JSON array, using the exact format shown in the input.
      
      Here is the data (JSON):
      ${JSON.stringify(coursesJSON, null, 2)}
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

    console.log(response.text);

    return response.text;
  } catch (e) {
    return { message: "Failed to retrieve page." };
  }
});
