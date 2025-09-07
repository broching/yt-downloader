module.exports = {
  GOOGLE_CLOUD_PROJECT_ID: 'ai-trailblazer-403801',
  GOOGLE_CLOUD_LOCATION: 'us-central1',
  GOOGLE_CLOUD_DATA_STORE_LOCATION: 'global',
  GOOGLE_CLOUD_DATA_STORE_COLLECTION: 'default_collection',
  GOOGLE_CLOUD_DATA_STORE_BRANCH: 'default_branch',
  GOOGLE_CLOUD_MODEL: 'gemini-1.0-pro-001',
  GOOGLE_CLOUD_MASTER_BUCKET: 'course-autobot-master-bucket',
  DATA_STORE_LOC: 'global',
  DATA_STORE_ID: 'course-repo-datastore_1708327357700',
  MONGO_DB_NAME: 'automexa',
  USER_ROLES : {
    USER: 'user',
    ADMIN: 'admin',
  },
  MONGO_DB_COLLECTIONS: {
    USER: 'user',
  },
  USE_RAG: {
    YES: 'Yes',
    NO: 'No'
  },
  STATUS: {
    SUCCESS: 'Success',
    FAIL: 'Fail',
    PENDING: 'Pending'
  },
  OPERATION_STATUS: {
    SUCCESS: 'Success',
    ERROR: 'Error',
    IN_PROGRESS: 'In Progress'
  },
  COURSE_TYPE: {
    INFO : 'COURSE_INFO',
    OUTLINE : 'COURSE_OUTLINE',
    CONTENT : 'COURSE_CONTENT',
    QUIZ : 'COURSE_QUIZ',
    ASSIGNMENT : 'COURSE_ASSIGNMENT',
    SLIDE: 'COURSE_SLIDE',
  },
  TITLE_MIN_CHAR: 5,
  TITLE_MAX_CHAR: 100,
  SYNOPSIS_MIN_CHAR: 10,
  SYNOPSIS_MAX_CHAR: 500,
  OUTCOME_MIN_CHAR: 10,
  OUTCOME_MAX_CHAR: 400,
  COURSE_MIN_DURATION: 1,
  COURSE_MAX_DURATION: 14,
  TOPIC_MIN_CHAR: 5,
  TOPIC_MAX_CHAR: 100,
  CONTENT_MIN_CHAR: 5,
  CONTENT_MAX_CHAR: 500,
  SUBCONTENT_MIN_CHAR: 5,
  SUBCONTENT_MAX_CHAR: 500,
  USERNAME_MIN_CHAR: 3,
  USERNAME_MAX_CHAR: 50,
  PASSWORD_MIN_CHAR: 8,
  PASSWORD_MAX_CHAR: 50,
  DEFAULT_USER_PASSWORD: 'P@ssw0rd',
  MAX_JSON_CORRECTION_ATTEMPTS: 10,
  MAX_NUM_LO: 4,
  APP_SECRET: 'RrpvXfeeHgMFWDUyHwF4e8kdkIPy0rlL',
  TOKEN_EXPIRES_IN: '90d',
  MAX_FILES_UPLOAD: 10,
  MAX_FILE_SIZE: 30 * 1024 * 1024,
  DEFAULT_NUMBER_OF_QUIZ_QUESTIONS_PER_SUBTOPIC: 4,
  LOCAL_FILES_UPLOAD_PATH: './public/uploads/',
  UPLOADED_FILES_RETENTION_DAYS: 1,
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000,
  LOGGING_INTERVAL: 60 * 60 * 5,
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt'], // Must include the dot
  MASTER_PRESENTATION_ID: '1S5eZRSNeHWVQ0wIV12LY9LQQx1pfMcnkCQyM5FTQr0s',
  GOOGLE_SLIDES_URL: 'https://docs.google.com/presentation/d/{PRESENTATION_ID}/edit',
  GOOGLE_SLIDES_PREDEFINED_LAYOUTS: {
    TITLE: "TITLE",
    TITLE_AND_BODY: 'TITLE_AND_BODY'
  },
  DEFAULT_PROMPT_GENERATE_SLIDES_CONTENT : `You are a curriculum developer with deep knowledge in the subject matter.
  You will help to generate a set of presentation slides based content given in below:
  <<content>> 
  The slides must include an image prompt for image generation where applicable.
  The generated slides must be formatted based on json schema in <<>>. 
  The presentation slides should be appropriate for adult learners
  The presentation slides must be in English language ONLY.
  <<
 {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["slides"],
  "properties": {
    "slides": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["Title", "Content"],
        "properties": {
          "Title": {
            "type": "string"
          },
          "Subtitle": {
            "type": "string"
          },
          "Content": {
            "type": "string"
          },
          "SlideImagePrompt": {
            "type": "string"
          }
        }
      }
    }
  }
}
>>
`,
  DEFAULT_PROMPT_GENERATE_COURSE_NOTES : `You are a curriculum developer with deep knowledge in the subject matter.
  You will help to explain and elaborate in details and clear with appropriate examples used in real world in paragraphs without formatting styles based on the provided heading below:
  <<content>>
  The explanation should be aimed at technical college students in Singapore.
  The explanation must based on heading ONLY.
  Please output strictly in JSON schema provided in <<>>.
  Do not use markdown formatting for the output.
  Do not output '\n' and hidden characters.
  Do not output in bullet point list.
  Do not output in point form.
  Do not text wrap the output.
  Avoid outputting the << and >> tags.
  Avoid using backslash to concatenate strings.
  <<
 {
  "$schema": "http://json-schema.org/draft/2020-12/schema",
  "title": "Notes Schema",
  "description": "Schema for a notes object",
  "type": "object",
  "required": ["topic", "subTopic", "heading", "notes"],
  "properties": {
    "topic": {
      "type": "string",
      "description": "Provided Topic"
    },
    "subTopic": {
      "type": "string",
      "description": "Provided subTopic"
    },
    "heading": {
      "type": "string",
      "description": "Provided heading"
    },
    "notes": {
      "type": "string",
      "description": "Specific notes related to the course"
    }
  }
}
  >>
  `,
  DEFAULT_PROMPT_GENERATE_COURSE_OUTCOMES : `You are a curriculum developer with deep knowledge in the subject matter.
  you will help to generate course outcomes based on the Course Title, Course Synopsis below:
<<content>>
The course outcomes generated should be appropriate for adult learners.
Please output only the course outcomes in JSON format provided in <<>>.
Avoid outputting the << and >> tags.
<<
"outcomes": [
    {
      "outcome": "Outcome 1"
    },
    {
      "outcome": "Outcome 2"
    },
    and so on...
  ]
>>
  `
};
