export declare type SimpleReplacement = {
	mode: 'globalRegex';
	pattern: string;
	replacement: string;
};

export declare type Settings = {
	id: string;
	last_access: Date;
	url: string;
	settings: { replacements: SimpleReplacement[] };
};
